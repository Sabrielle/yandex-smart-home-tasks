'use strict'

var conf = require('./conf');
var fs = require("fs");
var bodyParser = require('body-parser');
var express = require('express');
var router = require('./controllers/router');
var app = express();

app.use('/public', express.static( __dirname + '/public'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'pug');

router(app);

app.listen(conf.get("server:port"), function() {
    console.log('Server listening on port ' + conf.get("server:port"));
});
