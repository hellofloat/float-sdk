'use strict';

require( 'es6-shim' );
var EventEmitter = require('events');
var extend = require( 'extend' );
var superagent = require( 'superagent' );

var Passwords = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'api-auth.hellofloat.com'
};

Passwords.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};

Passwords.requestReset = function( options, callback ) {
    var self = this;

    superagent
        .post( 'https://' + self.options.host + '/password_reset_request' )
        .send( options )
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            callback();
            self.emit( 'password_reset_request', {
                options: options,
                result: response.body
            } );
        } );
};

Passwords.reset = function( options, callback ) {
    var self = this;

    superagent
        .post( 'https://' + self.options.host + '/password_reset' )
        .send( options )
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            callback();
            self.emit( 'password_reset', {
                options: options,
                result: response.body
            } );
        } );
};
