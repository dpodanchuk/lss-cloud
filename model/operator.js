'use strict';

// import the necessary modules
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create an export function to encapsulate the model creation
module.exports = function() {
  // define schema
    var PersonSchema = new Schema({
        name: {
            first: String,
            last: String
        },
        login: String,
        passwordHash: String
    });

  // define a method to find the closest person
  // PersonSchema.methods.findClosest = function(cb) {
  //   return this.model('Person').find({
  //     loc: {$nearSphere: this.loc},
  //     name: {$ne: this.name}
  //   }).limit(1).exec(cb);
  // };

  mongoose.model('Person', PersonSchema);
};
