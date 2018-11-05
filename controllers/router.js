'use strict'

var fs = require("fs");
var api = require('./apiController');
var pug = require('pug');

module.exports = function (app) {

    app.get('/', (req, res) => {
        res.render('mainPage');
    });

    app.get('/broadcast', (req, res) => {
        res.render('video');
    });

    app.get('/main', (req, res) => {
        var cmp = pug.renderFile('./views/main.pug');
        res.send(cmp);
    });

    app.get('/video', (req, res) => {
        var cmp = pug.renderFile('./views/video-part.pug');
        res.send(cmp);
    });

    app.get('/status', api.getUptime);

    app.get('/api/events', api.eventsGetRequest);

    app.post('/api/events', api.eventsPostRequest);
   
    app.use((req, res) => {
	    res.status(404).send('<h1>Page not found</h1>');
	});

}