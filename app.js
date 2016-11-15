var fs = require('fs')
, path = require('path')
, multer = require('multer')({
    inMemory: true,
    onFileUploadComplete: function(file) {
        console.log('done');
    }
})
, http = require('http')
, https = require('https')
, dotenv = require('dotenv').config({silent: true})
, _ = require('lodash')

, privateKey  = fs.readFileSync(__dirname + '/sslcert/server.key', 'utf8')
, certificate = fs.readFileSync(__dirname + '/sslcert/server.crt', 'utf8')

, [mongo_protocol, mongo_host, mongo_port] = (process.env.MONGODB_PORT || "tcp://localhost:27017").split(/\:\/\/|\:/)
, [redis_protocol, redis_host, redis_port] = (process.env.REDIS_PORT || 'tcp://127.0.0.1:6379').split(/\:\/\/|\:/)
, mongoose = require('mongoose')
, options = {mongo: {}}
, DocumentModel = options.DocumentModel = require('./model/document.js')();

const PORT = parseInt(process.env.NODE_PORT) || 3001;

options.mongo = _.extend(options.mongo, {
    host: mongo_host,
    port :mongo_port,
    db: 'lss'
}); //FIXME use destructuring assignments

console.log(options.mongo);

var Promise = require('bluebird')
, seneca = Promise.promisifyAll(require('seneca')())
        // .use('redis-queue-transport',{
        //     'redis-queue': {
        //         timeout: 500,
        //         type: 'redis-queue',
        //         host: redis_host,
        //         port: redis_port
        //     }
        // })
        .use('web')
        .use('entity', options)
        .use('mongo-store', options.mongo)
        .use('src/health', options)
        .use('src/file-upload', options)
        .use('src/document', options)
        .listen( /* {type:'redis-queue'}*/ ),
    express = require('express');

// FIXME: probably share same mongo connection
mongoose.connect(
    `mongodb://${options.mongo.host}:${options.mongo.port}/${options.mongo.db}`, (err) => {
        if(err)
            throw err;
    });

var app = express()
 	.use(require('body-parser').json())
        .use(express.static(path.join(__dirname, 'public')))
 	.use(seneca.export('web'))
        .post('/upload', multer.array('document'), (req, resp, next)  => {
            if(!req.file && !req.files) return next();
            _.each(req.files, (file) => {
                seneca
                    .actAsync('role:fileUpload,cmd:getContent', {file: file})
                    .then((result) => {
                        console.log(file);
                        const now = new Date();
                        // FIXME finish node-jsdom implementation
                        /*
                         const jsdom = require('node-jsdom')
                         , wnd = jsdom(result.content, {
                         jQueryify: true
                         });
                         */
                        
                        DocumentModel
                            .create({
                                title: /* wnd.title || wnd.$('h1:eq(0)', wnd).text() || */ file.originalname,
                                created_at: now,
                                modified_at: now,
                                content:  result.content
                            }, (err, obj) => {
                                if(!err){
                                    console.log(`Document created at: ${obj.created_at}`);
                                }
                            });
                    })
                    .catch((err) => {
                        resp.status(500).json(err);
                    });
                
            });
            resp.status(200).json('OK');
            return null;
        });


var httpServer = http.createServer(app);
var credentials = {key: privateKey, cert: certificate};
var httpsServer = https.createServer(credentials, app);

// This is how you integrate Seneca with Express
httpServer.listen(PORT);
httpsServer.listen(PORT + 443);
