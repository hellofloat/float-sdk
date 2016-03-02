'use strict';

var EventEmitter = require( 'events' );
var extend = require( 'extend' );
var superagent = require( 'superagent' );

var Cards = module.exports = Object.assign( {}, EventEmitter.prototype );

var DEFAULTS = {
    host: 'api-cards.hellofloat.com'
};


/**
 * @api {init} float.cards.init(options) init
 * @apiName init
 * @apiGroup Cards
 * @apiDescription Initializes the sdk cards object.
 *
 * @apiParam (options) host The hostname of the service to connect to.
 *
 */
Cards.init = function( options ) {
    var self = this;
    self.options = extend( true, {}, DEFAULTS, options );
    return self;
};


/**
 * @api {POST} float.cards.createCard() createCard
 * @apiName createCard
 * @apiGroup Cards
 * @apiDescription Create a credit card.
 *
 * @apiSuccess {String} token The token identifying the card.
 * @apiSuccess {String} pan Primary Account Number, credit card number.
 * @apiSuccess {String} expiration The expiration date of the virtual credit card.
 * @apiSuccess {String} pin The 4-digit number to associate with the card.
 * @apiSuccess {String} last_four The last four digits of the credit card.
 * @apiSuccess {String} pin_is_set Defaults to false. State of the pin of the credit card.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 OK
 *     {
 *         token: "f39bfdd6-eff7-41bb-8073-c03e9d64bc9a",
 *         pan: "1111111111111111",
 *         expiration: "1119",
 *         pin: null,
 *         last_four: "1111",
 *         cvv_number: "111",
 *         pin_is_set: false
 *     }
 */
Cards.createCard = function( cb ) {
    var self = this;

    superagent
        .post( 'https://' + self.options.host + '/card' )
        .withCredentials()
        .send( {} )
        .end( function( error, response ) {
            if ( error ) {
                cb( response && response.body ? response.body : error );
                return;
            }

            cb( null, response );
        } );

};


/**
 * @api {GET} float.cards.getCard() getCard
 * @apiName getCard
 * @apiGroup Cards
 * @apiDescription Retrieve credit card information.
 *
 * @apiSuccess {String} token The token identifying the card.
 * @apiSuccess {String} pan Primary Account Number, credit card number. This endpoint does not show the full pan.
 * @apiSuccess {String} expiration The expiration date of the virtual credit card.
 * @apiSuccess {String} last_four The last four digits of the credit card.
 * @apiSuccess {String} pin_is_set Defaults to false. State of the pin of the credit card.
 *
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *         token: 'f39bfdd6-eff7-41bb-8073-c03e9d64bc9a',
 *         pan: '111111______1111',
 *         expiration: '1019',
 *         last_four: '1111',
 *         pin_is_set: false
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *         error_code: '400001',
 *         error_message: 'User input error/bad request'
 *     }
 *
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Not Found
 *     {
 *         "error_code" : "404001",
 *         "error_message" : "Card not found"
 *     }
 *
 */
Cards.getCard = function( cb ) {
    var self = this;

    superagent
        .get( 'https://' + self.options.host + '/card' )
        .withCredentials()
        .end( function( error, response ) {
            if ( error ) {
                cb( response && response.body ? response.body : error );
                return;
            }

            cb( null, response );
        } );

}