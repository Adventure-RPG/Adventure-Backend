module.exports = function (db) {
    //TODO: сделать покрасивше
    // var db_query = function (func, params, callback) {
    //     if (!params)
    //         return callback(new Error('Параметры запроса отсутсвуют.'));
    //     func(params, function (err, res) {
    //         if (err)
    //             return callback(err);
    //         callback(null, res)
    //     })
    // };

    return {
        all: function (params, callback) {
            // db_query(db.users.find, params, callback);
            db.users.find(params, function (err, res) {
                if (err)
                    return callback(err);
                callback(null, res)
            })
        },
        one: function (params, callback) {
            // db_query(db.users.findOne, params, callback);
            db.users.findOne(params, function (err, res) {
                if (err)
                    return callback(err);
                callback(null, res)
            })
        },
        create: function(params, callback) {
            // db_query(db.users.save, params, callback);
            db.users.save(params, function (err, res) {
                if (err)
                    return callback(err);
                callback(null, res)
            })
        },
        update: function (params, callback) {
            // db_query(db.users.save, params, callback);
            db.users.save(params, function (err, res) {
                if (err)
                    return callback(err);
                callback(null, res)
            })
        },
        delete: function (params, callback) {
            // db_query(db.users.destroy, params, callback);
            db.users.destroy(params, function (err, res) {
                if (err)
                    return callback(err);
                callback(null, res)
            })
        }
    };
};