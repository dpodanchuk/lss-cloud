const _ = require('lodash')
, async = require('async');

module.exports = function(options){
    const DocumentModel = options.DocumentModel;

    var seneca = this;
    
    this.add('role:document,cmd:find', (msg, done) => {
        // FIXME use of deprecated mongoose mpromise library
        // plug in your own promise library instead http://mongoosejs.com/docs/promises.html
        const searchCriteria = msg.req$ && msg.req$.query?msg.req$.query.q:msg;
        console.log('SQ:', searchCriteria, msg.req$.query);
        DocumentModel
            .find(searchCriteria)
            .then(result => {
                return done(null, result);
            })
            .catch(err => {
                return done(err);
            });
    });

    this.add('role:document,cmd:update', (msg, done) => {
        // FIXME use of deprecated mongoose mpromise library
        // plug in your own promise library instead http://mongoosejs.com/docs/promises.html
        const body = msg.req$.body || msg.body
        , _id = msg._id;
        console.log(_id, body);
        //done(null, {status:'OK', _id: _id, body: body});
        console.log('Modifying', _id);
        DocumentModel
            .update({_id:_id}, body)
            .then(result => {
                return done(null, result);
            })
            .catch(err => {
                return done(err);
            });
    });
    
    seneca.ready((respond) => {
	console.log('init:api called, document');
    	this.act('role:web',{use:{
    	    prefix: '/api/document',
    	    pin:    'role:document, cmd:*',
    	    map: {
    		find: { GET: true, 'Content-type':'application/json' },
                update: { POST: true, suffix:'/:_id' }
    	    }
    	}}, respond);
    });
    
};
