var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var massive = require("massive");
var https = require('https');
var path = require('path');
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
//Connect to database
var db_config = {
    user: 'auth_user',
    pass: 'N60eiGBPI40Ip9o8',
    host: 'localhost',
    db: 'auth'
};
app.set('db', massive.connectSync({connectionString: require('util').format('postgres://%s:%s@%s/%s',
    db_config.user, db_config.pass, db_config.host, db_config.db)}));

app.all('/*', function(req, res, next) {
// CORS headers
res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// Set custom headers for CORS
res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
if (req.method == 'OPTIONS') {
    res.status(200).end();
} else {
    next();
}
});
app.use(express.static('static'));
//app.all('/api/v1/*', [require('./middlewares/validateRequest')]);
app.use('/', require('./routes')(app.get('db')));
// If no route is matched by now, it must be a 404
app.use(function(req, res, next) {
var err = new Error('Not Found');
err.status = 404;
next(err);
});

//Server options
var options = {
    key: fs.readFileSync('keys/key.pem'),
    cert: fs.readFileSync('keys/cert.pem')
};

// Start the server
app.set('port', 7999);
var server = https.createServer(options, app).listen(app.get('port'), function() {
console.log('Authorization server listening on port ' + server.address().port);
});