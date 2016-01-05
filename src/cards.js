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
            console.log('\u000A');
            console.log('---- response.body ----');
            console.log(response.body);
        });
};

Cards.getCard = function(id, cb) {
    var self = this;


}