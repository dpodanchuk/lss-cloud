const _ = require('lodash')
, async = require('async');

module.exports = function(options){
    var seneca = this;
    
    this.add('role:fileUpload,cmd:getContent', (msg, done) => {
        // TODO analyze mimetype and extract right content
        if((msg.file.mimetype !== 'text/html') && (msg.file.mimetype !== 'text/plain')){
            // FIXME make sure done() with error is called and properly handled
            throw new Error(`Mimetype "${msg.file.mimetype}" is not supported`);
            
        } else {
            done(null, {
                status: 'OK',
                content: new String(msg.file.buffer, 'utf-8')
            });
        }
    });

    seneca.ready((respond) => {
        // TODO implement fileupload processing with senecajs
        // use this sample: https://github.com/rjrodger/seneca-examples/blob/master/plugin-web/page-plugin/index.js
	console.log('init:api called, file-upload');
    	this.act('role:web',{use:{
    	    prefix: '/api/file-upload',
    	    pin:    'role:fileUpload, cmd:*',
    	    map: {
    		getContent: { POST: true }
    	    }
    	}}, respond);
    });
    
};
