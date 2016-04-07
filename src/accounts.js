'use strict';

var EventEmitter = require( 'events' );
var extend = require( 'extend' );
var superagent = require( 'superagent' );

var Accounts = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: "accounts.float.systems"
};



/**
 * @api {init} float.accounts.init(options) init
 * @apiName init
 * @apiGroup Accounts
 * @apiDescription Initializes the sdk accounts object.
 *
 * @apiParam (options) host The hostname of the service to connect to.
 *
 */
Accounts.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};


/**
 * @api {post} float.accounts.addBank() addBank
 * @apiName AddBankAccount
 * @apiGroup Accounts
 * @apiDescription Add a bank account.
 *
 * @apiParam (body) {String} [token] A Plaid Auth token allowing ACH access to the user's account
 * @apiParam (body) {String} [username] The user's banking username
 * @apiParam (body) {String} [password] The user's banking password
 * @apiParam (body) {String} [type] The user's institution 'type' as specified by Plaid
 * @apiParam (body) {String} [mfa] MFA response
 *
 * @apiSuccess {Boolean} [added] True when bank account has been successfully added
 * @apiSuccess {Object} [mfa] Returned when additional Multi-Factor Authentication is required
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         added: true
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         error: 'bank account conflict',
 *         message: 'This bank account is already associated with an existing Float account.',
 *     }
 */
Accounts.addBank = function( overlay, cb ) {
    var self = this;

    superagent
        .post( self.options.host + '/account/bank' )
        .withCredentials()
        .send( overlay )
        .end( function( error, response ) {
            if ( error ) {
                cb( response && response.body ? response.body : error );
                return;
            }

            cb( null, response );
        } );
};


/**
 * @api {get} float.accounts.getBankAccount() getBankAccount
 * @apiName GetAccounts
 * @apiGroup Accounts
 * @apiDescription Get accounts.
 *
 * @apiSuccess {Array} N/A Returns a json array of account objects
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [ {
 *         "_id": "QPO8Jo8vdDHMepg41PBwckXm4KdK1yUdmXOwK",
 *         "_item":"KdDjmojBERUKx3JkDd9RuxA5EvejA4SENO4AA",
 *         "_user":"eJXpMzpR65FP4RYno6rzuA7OZjd9n3Hna0RYa",
 *         "balance": {
 *             "available":1203.42,
 *             "current":1274.93
 *         },
 *         "institution_type": "fake_institution",
 *         "meta": {
 *             "name": "Plaid Savings",
 *             "number": "9606"
 *         },
 *         "numbers": {
 *             "routing":"021000021",
 *             "account":"9900009606",
 *             "wireRouting":"021000021"
 *         },
 *         "subtype":"savings",
 *         "type":"depository"
 *     } ]
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         error: 'no bank accounts linked',
 *         message: 'You do not have any bank accounts linked to your account.',
 *     }
 */
Accounts.getBankAccount = function( cb ) {
    var self = this;

    superagent
        .get( self.options.host + '/accounts' )
        .withCredentials()
        .end( function( error, response ) {
            if ( error ) {
                cb( response && response.body ? response.body : error );
                return;
            }

            cb( null, response );
        } );
};


/**
 * @api {delete} float.accounts.delete(id=null) del
 * @apiName delete
 * @apiGroup Accounts
 * @apiDescription Delete a bank account
 *
 * @apiParam (query) {String} [id] Account id to delete
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         "deleted": true
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 403 Permission Denied
 *     {
 *         error: 'permission denied',
 *         message: 'You do not have permission to access this resource.'
 *     }
 */
Accounts.deleteBankAccount = function( account, cb ) {
    var self = this;

    superagent
        .del( self.options.host + '/account/bank/' + account.id )
        .withCredentials()
        .end( function( error, response ) {
            if ( error ) {
                callback( response && response.body ? response.body : error );
                return;
            }

            callback();
        } );
};