'use strict';

var test = require('tape-catch');
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
