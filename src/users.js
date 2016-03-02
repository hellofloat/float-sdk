'use strict';

var diff = require( 'deep-diff' ).diff;
var EventEmitter = require( 'events' );
var extend = require( 'extend' );
var superagent = require( 'superagent' );

var Users = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'auth.float.systems'
};


/**
 * @api {init} float.users.init(options) init
 * @apiName init
 * @apiGroup Users
 * @apiDescription Initializes the sdk users object.
 *
 * @apiParam (options) host The hostname of the service to connect to.
 *
 */
Users.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};


/**
 * @api {get} float.user.get(id=null) get
 * @apiName get
 * @apiGroup Users
 * @apiDescription Get a user
 *
 * @apiParam (params) id User id to retrieve, if unspecified will retrieve the current user
 *
 * @apiSuccess {String} id ID
 * @apiSuccess {String} email Email address
 * @apiSuccess {String} phone Phone number (normalized)
 * @apiSuccess {String} ssn4 Last 4 of SSN
 * @apiSuccess {String} pin PIN
 * @apiSuccess {String} first_name First name
 * @apiSuccess {String} last_name Last name
 * @apiSuccess {String} address1 Address 1
 * @apiSuccess {String} address2 Address 2
 * @apiSuccess {String} zipcode Zip code
 * @apiSuccess {String} birthDay Birth day
 * @apiSuccess {String} birthMonth Birth month
 * @apiSuccess {String} birthYear Birth year
 * @apiSuccess {String} createdAt Created at date string
 * @apiSuccess {String} updatedAt Updated at date string
 * @apiSuccess {String} deletedAt Deleted at date string
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         id: "177f2006-bd93-4b42-b630-d0ff7d797cb0",
 *         email: "person@place.com",
 *         phone: "+1234567890",
 *         ssn4: "1234",
 *         pin: null,
 *         first_name: "First",
 *         last_name: "Last",
 *         address1: "123 Street Ln",
 *         address2: null,
 *         zipcode: "12345",
 *         birthDay: "01",
 *         birthMonth: "01",
 *         birthYear: "1995",
 *         verified: {
 *             email: false,
 *             phone: false,
 *             address: false,
 *             birthDate: false
 *         },
 *         createdAt: "2015-10-17T02:54:36.097Z",
 *         updatedAt: "2015-10-17T02:54:36.097Z",
 *         deletedAt: null
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Permission Denied
 *     {
 *         error: 'permission denied',
 *         message: 'You do not have permission to access this resource.'
 *     }
 */

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
        .withCredentials()
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


/**
 * @api {post} float.user.create(overlay) create
 * @apiName create
 * @apiGroup Users
 * @apiDescription Create a user
 *
 * @apiParam (body) {String} [id] A globally-unique id (GUID/UUID) for the user
 * @apiParam (body) {String} [email] Email address (at least 1 of email or phone required)
 * @apiParam (body) {String} [phone] Phone number (at least 1 of email or phone required)
 * @apiParam (body) {String} [password] A password for the user
 * @apiParam (body) {String} [ssn4] Last 4 of SSN
 * @apiParam (body) {String} [pin] PIN
 * @apiParam (body) {String} [first_name] First name
 * @apiParam (body) {String} [last_name] Last name
 * @apiParam (body) {String} [address1] Address 1
 * @apiParam (body) {String} [address2] Address 2
 * @apiParam (body) {String} [zipcode] Zip code
 * @apiParam (body) {String} [birthDay] Birth day
 * @apiParam (body) {String} [birthMonth] Birth month
 * @apiParam (body) {String} [birthYear] Birth year
 *
 * @apiSuccess {String} id A globally-unique id (GUID/UUID) for the user
 * @apiSuccess {String} email Email address
 * @apiSuccess {String} phone Phone number (normalized)
 * @apiSuccess {String} ssn4 Last 4 of SSN
 * @apiSuccess {String} pin PIN
 * @apiSuccess {String} first_name First name
 * @apiSuccess {String} last_name Last name
 * @apiSuccess {String} address1 Address 1
 * @apiSuccess {String} address2 Address 2
 * @apiSuccess {String} zipcode Zip code
 * @apiSuccess {String} birthDay Birth day
 * @apiSuccess {String} birthMonth Birth month
 * @apiSuccess {String} birthYear Birth year
 * @apiSuccess {String} createdAt Created at date string
 * @apiSuccess {String} updatedAt Updated at date string
 * @apiSuccess {String} deletedAt Deleted at date string
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         id: "177f2006-bd93-4b42-b630-d0ff7d797cb0",
 *         email: "person@place.com",
 *         phone: "+1234567890",
 *         ssn4: "1234",
 *         pin: null,
 *         first_name: "First",
 *         last_name: "Last",
 *         address1: "123 Street Ln",
 *         address2: null,
 *         zipcode: "12345",
 *         birthDay: "01",
 *         birthMonth: "01",
 *         birthYear: "1995",
 *         verified: {
 *             email: false,
 *             phone: false,
 *             address: false,
 *             birthDate: false
 *         },
 *         createdAt: "2015-10-17T02:54:36.097Z",
 *         updatedAt: "2015-10-17T02:54:36.097Z",
 *         deletedAt: null
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         error: 'user conflict',
 *         message: 'A user already exists with this id, email or phone number.'
 *     }
 */
Users.create = function( overlay, callback ) {
    var self = this;

    superagent
        .post( 'https://' + self.options.host + '/user' )
        .withCredentials()
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

/**
 * @api {put} float.users.update(id) update
 * @apiName update
 * @apiGroup Users
 * @apiDescription Update a user
 *
 * @apiParam (query) {String} [id] User id to update, if unspecified will update the current user
 *
 * @apiParam (body) {String} [email] Email address (at least 1 of email or phone required)
 * @apiParam (body) {String} [phone] Phone number (at least 1 of email or phone required)
 * @apiParam (body) {String} [ssn4] Last 4 of SSN
 * @apiParam (body) {String} [pin] PIN
 * @apiParam (body) {String} [first_name] First name
 * @apiParam (body) {String} [last_name] Last name
 * @apiParam (body) {String} [address1] Address 1
 * @apiParam (body) {String} [address2] Address 2
 * @apiParam (body) {String} [zipcode] Zip code
 * @apiParam (body) {String} [birthDay] Birth day
 * @apiParam (body) {String} [birthMonth] Birth month
 * @apiParam (body) {String} [birthYear] Birth year
 *
 * @apiSuccess {String} id ID
 * @apiSuccess {String} email Email address
 * @apiSuccess {String} phone Phone number (normalized)
 * @apiSuccess {String} ssn4 Last 4 of SSN
 * @apiSuccess {String} pin PIN
 * @apiSuccess {String} first_name First name
 * @apiSuccess {String} last_name Last name
 * @apiSuccess {String} address1 Address 1
 * @apiSuccess {String} address2 Address 2
 * @apiSuccess {String} zipcode Zip code
 * @apiSuccess {String} birthDay Birth day
 * @apiSuccess {String} birthMonth Birth month
 * @apiSuccess {String} birthYear Birth year
 * @apiSuccess {String} createdAt Created at date string
 * @apiSuccess {String} updatedAt Updated at date string
 * @apiSuccess {String} deletedAt Deleted at date string
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         id: "177f2006-bd93-4b42-b630-d0ff7d797cb0",
 *         email: "person@place.com",
 *         phone: "+1234567890",
 *         ssn4: "1234",
 *         pin: null,
 *         first_name: "First",
 *         last_name: "Last",
 *         address1: "123 Street Ln",
 *         address2: null,
 *         zipcode: "12345",
 *         birthDay: "01",
 *         birthMonth: "01",
 *         birthYear: "1995",
 *         verified: {
 *             email: false,
 *             phone: false,
 *             address: false,
 *             birthDate: false
 *         },
 *         createdAt: "2015-10-17T02:54:36.097Z",
 *         updatedAt: "2015-10-17T02:54:36.097Z",
 *         deletedAt: null
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Permission Denied
 *     {
 *         error: 'permission denied',
 *         message: 'You do not have permission to access this resource.'
 *     }
 */
Users.update = function( user, overlay, callback ) {
    var self = this;

    superagent
        .put( 'https://' + self.options.host + '/user/' + user.id )
        .withCredentials()
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


/**
 * @api {delete} float.user.delete(id=null) del
 * @apiName delete
 * @apiGroup Users
 * @apiDescription Delete a user
 *
 * @apiParam (query) {String} [id] User id to update, if unspecified will delete the current user
 *
 * @apiParam (body) {Boolean} [permanent] If set, will permanently delete the user
 *
 * @apiSuccess {Boolean} deleted True if the user was successfully deleted
 * @apiSuccess {Boolean} permanent True if the user was permanently deleted
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "deleted": true,
 *         "permanent": true
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Permission Denied
 *     {
 *         error: 'permission denied',
 *         message: 'You do not have permission to access this resource.'
 *     }
 */

Users.del = function( user, callback ) {
    var self = this;

    superagent
        .del( 'https://' + self.options.host + '/user/' + user.id )
        .withCredentials()
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


/**
 * @api {post} float.users.login() login
 * @apiName login
 * @apiGroup Users
 * @apiDescription Log in
 *
 * @apiParam (body) {String} [email] Email address (at least 1 of email or phone required)
 * @apiParam (body) {String} [phone] Phone number (at least 1 of email or phone required)
 * @apiParam (body) {String} password The user's password
 *
 * @apiSuccess {String} id ID
 * @apiSuccess {String} email Email address
 * @apiSuccess {String} phone Phone number (normalized)
 * @apiSuccess {String} ssn4 Last 4 of SSN
 * @apiSuccess {String} pin PIN
 * @apiSuccess {String} first_name First name
 * @apiSuccess {String} last_name Last name
 * @apiSuccess {String} address1 Address 1
 * @apiSuccess {String} address2 Address 2
 * @apiSuccess {String} zipcode Zip code
 * @apiSuccess {String} birthDay Birth day
 * @apiSuccess {String} birthMonth Birth month
 * @apiSuccess {String} birthYear Birth year
 * @apiSuccess {String} createdAt Created at date string
 * @apiSuccess {String} updatedAt Updated at date string
 * @apiSuccess {String} deletedAt Deleted at date string
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         id: "177f2006-bd93-4b42-b630-d0ff7d797cb0",
 *         email: "person@place.com",
 *         phone: "+1234567890",
 *         ssn4: "1234",
 *         pin: null,
 *         first_name: "First",
 *         last_name: "Last",
 *         address1: "123 Street Ln",
 *         address2: null,
 *         zipcode: "12345",
 *         birthDay: "01",
 *         birthMonth: "01",
 *         birthYear: "1995",
 *         verified: {
 *             email: false,
 *             phone: false,
 *             address: false,
 *             birthDate: false
 *         },
 *         createdAt: "2015-10-17T02:54:36.097Z",
 *         updatedAt: "2015-10-17T02:54:36.097Z",
 *         deletedAt: null
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Permission Denied
 *     {
 *         error: 'permission denied',
 *         message: 'You are not authorized.'
 *     }
 */
Users.login = function( data, callback ) {
    var self = this;
    callback = callback || function() {};

    superagent
        .post( 'https://' + self.options.host + '/login' )
        .withCredentials()
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


/**
 * @api {post} float.users.logout logout
 * @apiName logout
 * @apiGroup Users
 * @apiDescription Log in
 *
 * @apiSuccess {Boolean} logged_out Indicates the user was successfully logged out.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         logged_out: true
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Permission Denied
 *     {
 *         error: 'permission denied',
 *         message: 'You must be logged in to access this resource.'
 *     }
 */
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
        .withCredentials()
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