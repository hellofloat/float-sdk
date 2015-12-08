'use strict';

require( 'es6-shim' );
var diff = require( 'deep-diff' ).diff;
var EventEmitter = require('events');
var extend = require( 'extend' );
var superagent = require( 'superagent' );

var Users = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'api-auth.hellofloat.com'
};

Users.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};

Users.get = function( id, callback ) {
    var self = this;
    callback = typeof id === 'function' ? id : callback;
    id = typeof id === 'function' ? {
        id: null,
        force: false
    } : id;

    var options = typeof id === 'string' ? {
        id: id,
        force: false
    } : id;

    // TODO: combine these logic statements once jshint fixes warning 126
    var sameUser = self._user && self._user.id === options.id;
    var gettingLoggedInUser = !options.id || sameUser;

    if ( !options.force && gettingLoggedInUser && self._user ) {
        callback( null, self._user );
        return;
    }

    superagent
        .get( 'https://' + self.options.host + '/user' + ( options.id ? '/' + options.id : '' ) )
        .end( function( error, response ) {
            if ( error && error.status !== 400 ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            var user = error.status !== 400 ? response.body : null;
            var existingUser = self._user;
            if ( gettingLoggedInUser ) {
                self._user = user;
            }

            // if there is no logged in user via the api, log out
            if ( !user && existingUser && gettingLoggedInUser ) {
                self.emit( 'logout', {
                    user: existingUser
                } );
            }
            // if the user has updated their settings
            else if ( user && existingUser && existingUser.id === user.id && diff( existingUser, user ) ) {
                self.emit( 'updated', {
                    old: existingUser,
                    user: user
                } );
            }
            // if there was no existing user and we now have a user
            else if ( user && !existingUser && gettingLoggedInUser ) {
                self.emit( 'login', {
                    user: user
                } );
            }

            callback( null, user );
        } );
};

Users.create = function( overlay, callback ) {
    var self = this;

    superagent
        .post( 'https://' + self.options.host + '/user' )
        .send( overlay )
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            var user = response.body;

            if ( self._user ) {
                self.emit( 'logout', {
                    user: self._user
                } );
            }

            self._user = user;
            self.emit( 'login', {
                user: self._user
            } );

            callback( null, user );
        } );
};

Users.update = function( user, overlay, callback ) {
    var self = this;

    superagent
        .put( 'https://' + self.options.host + '/user/' + user.id )
        .send( overlay )
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            var _user = response.body;
            if ( self._user && self._user.id === user.id ) {
                self.emit( 'updated', {
                    old: self._user,
                    user: _user
                } );
                self._user = _user;
            }

            callback( null, _user );
        } );
};

Users.del = function( user, callback ) {
    var self = this;

    superagent
        .del( 'https://' + self.options.host + '/user/' + user.id )
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            if ( self._user && self._user.id === user.id ) {
                self.emit( 'logout', {
                    user: self._user
                } );
                self._user = null;
            }

            callback();
        } );
};

Users.login = function( data, callback ) {
    var self = this;
    callback = callback || function() {};

    superagent
        .post( 'https://' + self.options.host + '/login' )
        .send( data )
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            var user = response.body;
            var existingUser = self._user;
            if ( existingUser ) {
                self._user = null;
                self.emit( 'logout', {
                    user: existingUser
                } );
            }

            self._user = user;
            self.emit( 'login', {
                user: self._user
            } );

            callback( null, self._user );
        } );
};

Users.logout = function( callback ) {
    var self = this;
    callback = callback || function() {};

    var existingUser = self._user;
    if ( !existingUser ) {
        callback();
        return;
    }

    superagent
        .post( 'https://' + self.options.host + '/logout' )
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            self._user = null;
            self.emit( 'logout', {
                user: existingUser
            } );

            callback();
        } );
};
