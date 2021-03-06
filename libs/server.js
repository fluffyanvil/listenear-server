/**
 * Created by admin on 7/25/2017.
 */
var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express();
var mongoose     = require("mongoose");
var logger = require('./log4js').Logger



mongoose.connect(process.env.MONGO_CONNECTION, {
    useMongoClient: true
});
var db = mongoose.connection;
db.once('open', function callback () {
    console.log("Connected to DB!");
});

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

require('./routes')(app, logger);

var server = app.listen(process.env.PORT, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Web server started at http://%s:%s', host, port);
    logger.info('Web server started at http://%s:%s', host, port);
});

