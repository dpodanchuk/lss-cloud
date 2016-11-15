'use strict';

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Person = require('./person.js');

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
    var DocumentSchema = new Schema({
        title: String,
        created_at: Date,
        modified_at: Date,
        content: String,
        versions: [String]
    });

    // define a method to find the closest person
    // DocumentSchema.methods.findClosest = function(cb) {
    //   return this.model('Document').find({
    //     loc: {$nearSphere: this.loc},
    //     name: {$ne: this.name}
    //   }).limit(1).exec(cb);
    // };

    return mongoose.model('Document', DocumentSchema);
};
