'use strict';

// tape is running correctly
// float sdk was loaded correctly
// api objects are not loaded pre init
// api object are set on float after init

var test = require('tape');
var float = require('../index');

test('default passing test', (t) => {
    t.plan(1);
    t.pass('This test should always pass.');
    t.end();
});


test('float sdk require', function (t) {
    t.plan(1);
    t.equal(typeof float.constructor, 'function', 'float SDK was loaded correctly');
    t.end();
});


test('float pre initialize', function (t) {
    t.plan(4);
    t.equal(float.users, undefined, 'Users was not initialized.');
    t.equal(float.passwords, undefined, 'Passwords was not initialized.');
    t.equal(float.scoring, undefined, 'Scoring was not initialized.');
    t.equal(float.cards, undefined, 'Cards was not initialized.');
    t.end();
});


test('float post initialize', function (t) {
    float.Float.init({
        hosts: {
            users: "qa-api.hellofloat.com:4443",
            passwords: "qa-api.hellofloat.com:4443",
            scoring: "qa-api.hellofloat.com:443",
            cards: "qa-api.hellofloat.com:4445"
        }
    });

    t.plan(4);
    t.equal(typeof float.users.constructor, 'function', 'Users was initialized.');
    t.equal(typeof float.passwords.constructor, 'function', 'Passwords was initialized.');
    t.equal(typeof float.scoring.constructor, 'function', 'Scoring was initialized.');
    t.equal(typeof float.cards.constructor, 'function', 'Cards was initialized.');
    t.end();
});