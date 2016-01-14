'use strict';

// api service is running -- checking the __epicenter
// init function works
// get function works
// login function works

// create function works
// update function works
// delete function works
// logout function works

var test = require('tape');
var float = require('../index');
var request = require('supertest').agent('https://qa-api.hellofloat.com:4443/');
var expectedUser = { 
    address1: 'Street Address',
    address2: '2nd Address',
    birthDay: '11',
    birthMonth: '08',
    birthYear: '1976',
    createdAt: '2015-11-05T00:44:28.572Z',
    deletedAt: null,
    email: 'bruce@hellofloat.com',
    first_name: 'Bruce',
    id: 'd91e8815-48bb-4310-ae61-14d743744d0f',
    last_name: 'Lim',
    phone: '+12133949546',
    pin: '1234',
    ssn4: '6789',
    updatedAt: '2015-11-05T02:12:53.948Z',
    verified: { address: false, birthDate: false, email: false, phone: false },
    zipcode: '00000' 
};


test('users api is running', (t) => {
    request
        .get('__epicenter')
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(error, response) {
            t.error(error, 'No error');
            t.ok(response.body.api.version, 'version is set');
            t.end();

            // float.Float.init();
        });
});


test('init Float', (t) => {
    float.Float.init();

// console.log(float.users)
    t.equal(typeof float.users.constructor, 'function', 'float.user object was initialized.');
    t.end();
});



test('user init configuration', (t) => {
    float.users.init({
        host: "qa-api.hellofloat.com:4443"
    })

    t.equal(float.users.options.host, 'qa-api.hellofloat.com:4443', 'float.users.init is setting params correctly');
    t.end();
});



test('user - permissions error', (t) => {
    float.users.get(function(error, user) {
        t.ok(error, 'Error object is returned.');
        t.equal(error.error, 'permission denied', 'Permission denied');
        t.end();
    });   
});



test('user - login', (t) => {
    var login = {
        "email": "bruce@hellofloat.com",
        "password": ""
    };

    float.users.login(login, function(error, user) {
        t.error(error, 'No error');
        
        t.same(user, expectedUser, 'expected user');
        t.end();
    });
})



test('user - get by id function', (t) => {
    var id = 'd91e8815-48bb-4310-ae61-14d743744d0f';

    float.users.get(id, function(error, user) {
        t.error(error, 'No error');
        t.same(user, expectedUser, 'expected user');
        t.end();
    });
});



test('user - get without id function', (t) => {
    float.users.get(function(error, user) {
        t.error(error, 'No error');
        t.same(user, expectedUser, 'expected user');
        t.end();
    });
});




// test('user - logout', (t) => {
//     var logoutResponse = {
//         "logged_out": true
//     };

//     float.users.logout(function(error, res) {
//         t.error(error, 'No error');
//         console.log(res)
//         t.same(res, logoutResponse, 'expected logout response');
//         t.end();
//     });
// });


// test('user - permissions error', (t) => {
//     float.users.get(function(error, user) {
//         t.ok(error, 'Error object is returned.');
//         t.equal(error.error, 'permission denied', 'Permission denied');
//         t.end();
//     });   
// });
