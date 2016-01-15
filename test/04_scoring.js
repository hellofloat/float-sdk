'use strict';

// init
// addBank
// getBankAccount
// getScore

var test = require('tape');
var float = require('../index');

var request = require('supertest').agent('https://qa-api.hellofloat.com:443/');

test('scoring api is running', (t) => {
    request
        .get('__epicenter')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(error, response) {
            t.error(error, 'No error');
            t.ok(response.body.api.version, 'version is set');
            t.end();
        });
});



test('init Float', (t) => {
    float.Float.init();

    t.equal(typeof float.scoring.constructor, 'function', 'float.scoring object was initialized.');
    t.end();
});



test('scoring init configuration', (t) => {
    float.scoring.init({
        host: "qa-api.hellofloat.com:443"
    })

    t.equal(float.scoring.options.host, 'qa-api.hellofloat.com:443', 'float.scoring.init is setting params correctly');
    t.end();
});