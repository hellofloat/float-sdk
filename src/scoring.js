'use strict';

var EventEmitter = require('events');
var extend = require('extend');
var superagent = require('superagent');

var Scoring = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'api-scoring.hellofloat.com'
};


Scoring.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};


Scoring.addBank = function(overlay, cb) {
    var self = this;

    superagent
        .post('https://' + self.options.host + '/source/bankaccount')
        .send(overlay)
        .end(function(error, response) {
            if(error) {
                cb(response && response.body ? response.body : error);
                return;
            }

            callback(null, response);
        });

};


Scoring.getBankAccount = function(cb) {
    var self = this;

    superagent
        .get('https://' + self.options.host + '/accounts')
        .end(function(error, response) {
            if(error) {
                cb(response && response.body ? response.body : error);
                return;
            }

            callback(null, response);
        });

};

Scoring.getScore = function(cb) {
    var self = this;

    superagent
        .get('https://' + self.options.host + '/score')
        .end(function(error, response) {
            if(error) {
                cb(response && response.body ? response.body : error);
                return;
            }

            callback(null, response);
        });

};