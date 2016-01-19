'use strict';

// init
// requestReset
// reset

var test = require('tape');
var float = require('../index');

var request = require('supertest').agent('https://qa-api.hellofloat.com:4443/');

test('passwords api is running', (t) => {
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

    t.equal(typeof float.passwords.constructor, 'function', 'float.passwords object was initialized.');
    t.end();
});



test('passwords init configuration', (t) => {
    float.passwords.init({
        host: "qa-api.hellofloat.com:4443"
    });

    t.equal(float.passwords.options.host, 'qa-api.hellofloat.com:4443', 'float.passwords.init is setting params correctly');
    t.end();
});



test('password request reset', (t) => {
    var expected = {
        "password_reset_requested": true
    };

    float.passwords.requestReset({
        email: "bruce@hellofloat.com"
    }, function(error, response) {
        t.error(error, 'No error');
        t.same(response, expected, 'password reset requested');
        t.end();
    });
});



test('password reset - bad token', (t) => {
    var passwordResetToken = 'bad-token';
    var expected = {
        "error": "missing password reset token",
        "message": "You must specify a valid password reset token."
    };

    float.passwords.reset({
        token: passwordResetToken,
        password: "new_horrible_password"
    }, function(error, response) {
        t.same(error, expected, 'Using bad token should fail.');
        t.end();
    })
});