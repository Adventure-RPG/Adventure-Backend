module.exports = function (db) {
    var express = require('express');
    var router = express.Router();
    //Users
    var users = require('./users.js')(db);
    router.get('/api/v1/users', users.all);
    router.get('/api/v1/users/:id', users.one);
    router.post('/api/v1/users/', users.create);
    router.put('/api/v1/users/:id', users.update);
    router.delete('/api/v1/users/:id', users.delete);
    //Auth
    var auth = require('./auth.js')(db);
    router.post('/login', auth.login);
    return router;
};
 
//var auth = require('./auth.js');
 
/*
 * Routes that can be accessed by any one
 */
//router.post('/login', auth.login);
/*
 * Routes that can be accessed only by authenticated & authorized users
 */
