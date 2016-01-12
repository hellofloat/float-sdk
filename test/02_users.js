'use strict';

var test = require('tape');
var float = require('../index');

var request = require('supertest').agent('https://qa-api.hellofloat.com:4443/');

test('users api is running', (t) => {
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

