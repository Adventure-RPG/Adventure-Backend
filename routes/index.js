module.exports = function (db) {
    var express = require('express');

    var router = express.Router();
    var users = require('./users.js')(db);
    router.get('/api/v1/users', users.all);
    router.get('/api/v1/users/:id', users.one);
    router.post('/api/v1/users/', users.create);
    router.put('/api/v1/users/:id', users.update);
    router.delete('/api/v1/users/:id', users.delete);

    return router;
};
 
//var auth = require('./auth.js');
//var products = require('./products.js');
 
/*
 * Routes that can be accessed by any one
 */
//router.post('/login', auth.login);
 
/*
 * Routes that can be accessed only by autheticated users
 */
/*
router.get('/api/v1/products', products.getAll);
router.get('/api/v1/product/:id', products.getOne);
router.post('/api/v1/product/', products.create);
router.put('/api/v1/product/:id', products.update);
router.delete('/api/v1/product/:id', products.delete);
 */
/*
 * Routes that can be accessed only by authenticated & authorized users
 */
