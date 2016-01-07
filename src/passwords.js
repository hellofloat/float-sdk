'use strict';

require( 'es6-shim' );
var EventEmitter = require('events');
var extend = require( 'extend' );
var superagent = require( 'superagent' );

var Passwords = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'api-auth.hellofloat.com'
};


/**
 * @api {init} float.passwords.init(options) init
 * @apiName init
 * @apiGroup Passwords
 * @apiDescription Initializes the sdk passwords object.
 *
 * @apiParam (options) host The hostname of the service to connect to.
 *
 */
Passwords.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};


/**
 * @api {post} float.passwords.requestReset() requestReset
 * @apiName PasswordResetRequest
 * @apiGroup Passwords
 * @apiDescription Request password reset
 *
 * @apiSuccess {Boolean} password_reset_requested Indicates the password reset was successfully requested.
 *
 * @apiParam (body) {String} [email] Email address (at least 1 of email or phone required)
 * @apiParam (body) {String} [phone] Phone number (at least 1 of email or phone required)
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         password_reset_requested: true
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Permission Denied
 *     {
 *         error: 'invalid password reset request',
 *         message: 'You must specify a valid email or phone number to reset a password.'
 *     }
 */
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


/**
 * @api {post} float.passwords.reset reset
 * @apiName PasswordReset
 * @apiGroup Passwords
 * @apiDescription Password reset
 *
 * @apiParam (body) {String} token Valid password reset request token
 * @apiParam (body) {String} password New password
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
 *     HTTP/1.1 400 Permission Denied
 *     {
 *         error: 'missing password reset token',
 *         message: 'You must specify a valid password reset token.'
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Permission Denied
 *     {
 *         error: 'missing password',
 *         message: 'You must specify a password.'
 *     }
 *
 */
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
