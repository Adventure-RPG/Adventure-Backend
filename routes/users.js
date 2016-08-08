module.exports = function (db) {
    var users = require('../models/users.js')(db);
    return {
        all: function (req, res) {
            users.all({is_active: true}, function (err, users) {
                if (err)
                    res.json({error: err.message});
                res.json(users);
            });
        },
        one: function(req, res) {
            users.one(parseInt(req.params.id), function (err, user) {
                if (err)
                    res.json({error: err.message});
                res.json(user);
        });
        },
        create: function(req, res) {
            users.create(req.body, function (err, inserted) {
                if (err)
                    res.json({error: err.message});
                res.json(inserted);
            });
        },
        update: function (req, res) {
            var updateuser = req.body;
            updateuser.id = parseInt(req.params.id);// add ID to body
            users.update(updateuser, function (err, updated) {
                if (err)
                    res.json({error: err.message});
                res.json(updated);
            });
        },
        delete: function (req, res) {
            users.delete(parseInt(req.params.id), function (err, destroyed) {
                if (err)
                    res.json({error: err.message});
                res.json(destroyed);
            });
        }
    };
};