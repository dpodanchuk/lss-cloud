
var mocha = require('mocha')
, chai = require('chai')
, chaiAsPromised = require('chai-as-promised')
, assert = chai.assert
, expect = chai.expect
, should = chai.should()
, _ = require('lodash');

var [mongo_protocol, mongo_host, mongo_port] = (process.env.MONGODB_PORT || "tcp://localhost:27017").split(/\:\/\/|\:/),
    options = {};

options.mongo = _.extend(options.mongo, {
    host: mongo_host,
    port :mongo_port,
    db: 'lss-test'
}); //FIXME use destructuring assignments

var mongoose = require('mongoose')
, DocumentModel = options.DocumentModel = require('../../../model/document.js')();


// FIXME: probably share same mongo connection
mongoose.connect(
    `mongodb://${options.mongo.host}:${options.mongo.port}/${options.mongo.db}`, (err) => {
        if(err)
            throw err;
    });

// const Promise = require('bluebird');
// var seneca =  Promise.promisifyAll(require('seneca')(), {suffix:'Async'})
//         .use('mem-store',  options.mongo)
// //.use('mongo-store',  options.mongo)
//         .use('entity')
//         .use('src/exec', options)
//         .use('src/action', options)
//         .use('src/email', options);

describe('Model', () => {
    before((done) => {
        //seneca.ready(done);
        done();
    });
    describe('DocumentModel', () => {
        const TITLE = 'Some title'
        , NOW = new Date()
        , CONTENT = '<html></html>';
        
        it('should store properly filled document', (done) => {
            DocumentModel
                .create({
                    title: TITLE,
                    created_at: NOW,
                    modified_at: NOW,
                    content:  CONTENT // some html content
                }, (err, obj) => {
                    // FIXME ensure `mocha --watch` does not raise `OverwriteModelError: Cannot overwrite `Document` model once compiled.` on DocumentModel
                    expect(obj).is.notNull;
                    // should use property check routine
                    expect(obj.title).is.notNull;
                    expect(obj.created_at).is.notNull;
                    expect(obj.content).is.notNull;

                    expect(obj.title).is.equal(TITLE);
                    expect(obj.created_at).is.equal(NOW);
                    expect(obj.created_at).is.equal(obj.modified_at); // ensure that DocumentModel.create set modified_at also
                    expect(obj.content).is.equal(CONTENT);
                    done();                    
                });
            
        });
        
    });
});
