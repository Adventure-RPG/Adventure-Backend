module.exports = function (db) {
    var jwt = require('jsonwebtoken');
    var crypto = require('crypto');
    var verify = require('../utils/passgen.js').verifyPassword;

    var cert = require('fs').readFileSync(__dirname + '/../keys/key.pem');

    var auth = {
        login: function(req, res) {
            var username = req.body.username || '';
            var password = req.body.password || '';

            if (username == '' || password == '') {
                res.status(401);
                return res.json({
                "status": 401,
                "message": "Учетные данные не были предоставлены."
            });
            }

            // Fire a query to your DB and check if the credentials are valid
            auth.validate(username, password, function (err, user) {
                if (err)
                {
                    res.status(401);
                    return res.json({"status": 400, "message": err.message});
                }
                genToken(user, function (err, token) {
                    if (err){
                        res.status(401);
                        return res.json({"status": 400, "message": err.message});
                    }
                    return res.json(token)
                })
            });
        },

        validate: function(username, password, callback) {
            // spoofing the DB response for simplicity
            require('../models/users.js')(db).one({username: username}, function (err, user) {
                if(err || !user)
                    return callback(new Error('Учетная запись не найдена.'));
                verify(password, user.password, function (err, ver) {
                    if (err || !ver)
                        return callback(new Error('Неверный логин или пароль.'));
                    callback(null, user)
                });
            });
        }
    };

// private method
function genToken(user, callback) {
var expires = expiresIn(7); // 7 days
var payload = {"id": user.id, "username": user.username, "group": user.group_id};
  jwt.sign(payload, cert, { algorithm: 'RS256'},
      function (err, token) {
        if (err)
            return callback(err);
        callback(null, {"token": token, "expires": expires, "user": payload});
  });
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

return auth;
};