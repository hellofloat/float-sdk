'use strict';

// init
// createCard
// getCard

var test = require('tape');
var float = require('../index');

var request = require('supertest').agent('https://qa-api.hellofloat.com:4445/');

test('cards api is running', (t) => {
    request
        .get('__epicenter')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(error, response) {
            t.error(error, 'No error');
            t.ok(response.body.version, 'version is set');
            t.end();
        });
});



test('init Float', (t) => {
    float.Float.init();

    t.equal(typeof float.cards.constructor, 'function', 'float.cards object was initialized.');
    t.end();
});



test('cards init configuration', (t) => {
    float.cards.init({
        host: "qa-api.hellofloat.com:4445"
    })

    t.equal(float.cards.options.host, 'qa-api.hellofloat.com:4445', 'float.cards.init is setting params correctly');
    t.end();
});