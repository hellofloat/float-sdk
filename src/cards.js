'use strict';

var EventEmitter = require('events');
var extend = require('extend');
var superagent = require('superagent');

var Cards = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'api-cards.hellofloat.com'
};

Cards.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};

Cards.createCard = function(cb) {
    var self = this;

    superagent
        .post('https://' + self.options.host + '/card')
        .send({})
        .end(function(error, response) {
            if(error) {
                cb(response && response.body ? response.body : error);
                return;
            }

            callback(null, response);
        });

};

Cards.getCard = function(cb) {
    var self = this;

    superagent
        .get('https://' + self.options.host + '/card')
        .end(function(error, response) {
            if(error) {
                cb(response && response.body ? response.body : error);
                return;
            }

            callback(null, response);
        });

}