'use strict';

require( 'es6-shim' );
var Delver = require( 'delver' );
var EventEmitter2 = require( 'eventemitter2' ).EventEmitter2;
var floatObjectFactory = require( 'float-object-factory' );
var extend = require( 'extend' );

var Users = require( './src/users.js' );
var Passwords = require( './src/passwords.js' );

var _defaults = {
    hosts: {
        users: 'api-auth.hellofloat.com',
        passwords: 'api-auth.hellofloat.com'
    }
};

var Float = Object.assign( {}, EventEmitter2.prototype );

Float.init = function( options ) {
    var self = this;

    self.options = extend( true, {}, _defaults, options );

    self.state = new Delver( {} );

    self.users = Object.create( Users );
    self.users.init( {
        host: self.options.hosts.users
    } );
    self._multiplexEmit( self.users, 'users' );
    self._multiplexBind( self.users, [ {
        method: 'get',
        alias: 'getUser'
    }, {
        method: 'login'
    }, {
        method: 'logout'
    }, {
        method: 'create',
        alias: 'createUser'
    }, {
        method: 'update',
        alias: 'updateUser'
    }, {
        method: 'del',
        alias: 'delUser'
    } ] );

    self.passwords = Object.create( Passwords );
    self.passwords.init( {
        host: self.options.hosts.passwords
    } );
    self._multiplexEmit( self.passwords, 'passwords' );
    self._multiplexBind( self.passwords, [ {
        method: 'requestReset',
        alias: 'requestPasswordReset'
    }, {
        method: 'reset',
        alias: 'resetPassword'
    } ] );

    self.objectFactory = floatObjectFactory;

    return self;
};

Float._multiplexBind = function( target, methods, namespace ) {
    var self = this;
    var selfTarget = self;

    if ( namespace ) {
        selfTarget = Delver.get( self, namespace );
        if ( !selfTarget ) {
            selfTarget = {};
            Delver.set( self, namespace, selfTarget );
        }
    }

    methods.forEach( function( method ) {
        var realMethod = null;
        var alias = null;

        if ( typeof method === 'object' ) {
            realMethod = method.method;
            alias = method.alias || method.method;
        }
        else {
            realMethod = method;
            alias = method;
        }

        if ( !realMethod || !alias ) {
            throw new Error( 'Not a valid method/alias setting: ' + method );
        }

        var targetFunction = target[ realMethod ];
        if ( typeof targetFunction !== 'function' ) {
            throw new Error( 'Invalid method on target (' + ( target.constructor ? target.constructor.name : 'unknown' ) + '): ' + realMethod );
        }

        selfTarget[ alias ] = targetFunction.bind( target );
    } );
};

Float._multiplexEmit = function( emitter, namespace ) {
    var self = this;

    // we bind a basic error handler to avoid unhandled exceptions
    // window.console.error.bind( window.console ) <-- can't do this in IE :(
    emitter.on( 'error', function( error ) {
        window.console.error( error );
    } );

    // we re-emit events as a convenience
    var originalEmit = emitter.emit;
    emitter.emit = function() {
        originalEmit.apply( emitter, arguments );

        var args = arguments;
        if ( namespace ) {
            args = Array.prototype.slice.call( arguments, 0 );
            var eventName = args.shift();
            eventName = namespace + '.' + eventName;
            args.unshift( eventName );
        }

        self.emit.apply( self, args );
    };
};

module.exports = Object.create( Float );
module.exports.Float = Float;
