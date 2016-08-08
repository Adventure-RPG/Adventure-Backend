module.exports = function (db) {
    return {
        all: function (req, res) {
            db.users.find({is_active: true}, function(err,users){
                if (err)
                    res.json({error: err.message});
                res.json(users);
            });
        },
        one: function(req, res) {
            var id = parseInt(req.params.id);
            db.users.findOne(id, function(err,user){
                if (err)
                    res.json({error: err.message});
                res.json(user);
            });
        },
        create: function(req, res) {
            var newuser = req.body;
            db.users.save(newuser, function(err,inserted){
                if (err)
                    res.json({error: err.message});
                res.json(inserted);
            });
        },
        update: function (res, req) {
            var updateuser = req.body;
            updateuser.id = parseInt(req.params.id);// add ID to body
            db.users.save(updateuser, function(err,updated){
                if (err)
                    res.json({error: err.message});
                res.json(updated);
            });
        },
        delete: function (req, res) {
            var id = parseInt(req.params.id);
            db.users.destroy(id, function (err, destroyed) {
                if (err)
                    res.json({error: err.message});
                res.json(destroyed);
            });
        }
    };
};