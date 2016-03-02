'use strict';

var EventEmitter = require( 'events' );
var extend = require( 'extend' );
var superagent = require( 'superagent' );

var Scoring = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'api-scoring.hellofloat.com'
};


/**
 * @api {init} float.scoring.init(options) init
 * @apiName init
 * @apiGroup Scoring
 * @apiDescription Initializes the sdk scoring object.
 *
 * @apiParam (options) host The hostname of the service to connect to.
 *
 */
Scoring.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};


/**
 * @api {post} float.scoring.addBank() addBank
 * @apiName AddBankAccount
 * @apiGroup Scoring
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
Scoring.addBank = function( overlay, cb ) {
    var self = this;

    superagent
        .post( 'https://' + self.options.host + '/source/bankaccount' )
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
 * @api {get} float.scoring.getBankAccount() getBankAccount
 * @apiName GetAccounts
 * @apiGroup Scoring
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
Scoring.getBankAccount = function( cb ) {
    var self = this;

    superagent
        .get( 'https://' + self.options.host + '/accounts' )
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
 * @api {get} float.scoring.getScore() getScore
 * @apiName GetScore
 * @apiGroup Scoring
 * @apiDescription Get Float score.
 *
 * @apiSuccess {Boolean} approved Boolean indicating if the user has been approved
 * @apiSuccess {Number} [limit] A number indicating the credit limit
 * @apiSuccess {String} [code] A code indicating a reason the user was not approved
 * @apiSuccess {Object} [meta] An optional meta object with relevant information based on code
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         approved: true,
 *         limit: 250
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 202 OK
 *     {
 *         approved: false,
 *         code: 'missing required snapshot',
 *         meta: {
 *             message: 'We currently do not have enough data to score you.'
 *         }
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         approved: false,
 *         code: 'unable to verify identity'
 *     }
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         approved: false,
 *         code: 'insufficient banking qualifications',
 *         meta: {
 *             risk_indicators: [ ... ]
 *         }
 *     }
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         approved: false,
 *         code: 'insufficient transaction history',
 *         meta: {
 *             required: MINIMUM_HISTORY_DAYS,
 *             actual: snapshots.banking.history.days
 *         }
 *     }
 *
 */
Scoring.getScore = function( cb ) {
    var self = this;

    superagent
        .get( 'https://' + self.options.host + '/score' )
        .withCredentials()
        .end( function( error, response ) {
            if ( error ) {
                cb( response && response.body ? response.body : error );
                return;
            }

            cb( null, response );
        } );

};