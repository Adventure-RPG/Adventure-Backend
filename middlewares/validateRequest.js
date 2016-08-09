var jwt = require('jsonwebtoken');
var cert = require('fs').readFileSync(__dirname + '/../keys/cert.pem');

module.exports = function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token){
        res.status(401);
        return res.json({
            "status": 401,
            "message": "Учетные данные не были предоставлены."
        })
    }
    jwt.verify(token, cert, function (err, decoded) {
        if (err || !decoded){
            res.status(401);
            if (err.name == "TokenExpiredError")
                return res.json({
                    "status": 401,
                    "message": "Идентификатор просрочен."
                });
            return res.json({
                    "status": 401,
                    "message": "Идентификатор неверен."
            })
        }
        if((req.url.indexOf('admin') >=0 && decoded.group == 1) || (req.url.indexOf('admin') < 0))
            next();
        else {
            res.status(403);
            return res.json({
                    "status": 403,
                    "message": "Недостаточно прав."
            })
        }
    })
};