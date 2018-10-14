'use strict'

var fs = require('fs');
var conf = require('./../conf');
var statuses = conf.get('statuses');

module.exports = {

	getUptime: (req, res) => {
		var uptime = Math.round(process.uptime());
		res.send(beautifyUptime(uptime));
	},

	eventsGetRequest: (req, res) => {

		if(!Object.keys(req.query).length) 
			return fs.readFile('./data/events.json', (err, content) => {
				if (err) throw err;
				return res.send(JSON.parse(content).events);
			});

		var type = (typeof(req.query.type) !== 'undefined') ? req.query.type : '';
		var limit = (typeof(req.query.limit) !== 'undefined') ? req.query.limit : '';
		var currentPage = (typeof(req.query.page) !== 'undefined') ? req.query.page : '';

		fs.readFile('./data/events.json', (err, content) => {

			if (err) throw err;
			if (type.length && !validateType(type)) 
				return res.status(400).send('incorrect type');

			var filtered = (type !== '') ? parseParams(type, content) : JSON.parse(content).events;
			
			if(limit.length && currentPage.length) {
				if(limit <= 0 || currentPage <= 0 || isNaN(limit) || isNaN(currentPage)) 
					return res.status(400).send('incorrect number of page or limit');
				var total = filtered.length;
				var totalPages = Math.ceil(total/limit);
				if(currentPage > totalPages) 
					return res.status(400).send('page number is too big');
				filtered = filtered.slice((currentPage - 1)*limit, currentPage*limit);
			}

			return res.send(filtered);
		})

	},

	eventsPostRequest: (req, res) => {
		
		if(!Object.keys(req.body).length) 
			return fs.readFile('./data/events.json', (err, content) => {
				if (err) throw err;
				return res.send(JSON.parse(content).events);
			});

		var type = (typeof(req.body.type) !== 'undefined') ? req.body.type : '';
		var limit = (typeof(req.body.limit) !== 'undefined') ? req.body.limit : '';
		var currentPage = (typeof(req.body.page) !== 'undefined') ? req.body.page : '';

		fs.readFile('./data/events.json', (err, content) => {

			if (err) throw err;
			if (type.length && !validateType(type))
				return res.status(400).send('incorrect type');

			var filtered = (type !== '') ? parseParams(type, content) : JSON.parse(content).events;
			
			if(limit.length && currentPage.length) {
				if(limit <= 0 || currentPage <= 0 || isNaN(limit) || isNaN(currentPage))
					return res.status(400).send('incorrect number of page or limit');
				var total = filtered.length;
				var totalPages = Math.ceil(total/limit);
				if(currentPage > totalPages) 
					return res.status(400).send('page number is too big');
				filtered = filtered.slice((currentPage - 1)*limit, currentPage*limit);
			}

			return res.send(filtered);
		})

	}

}

function validateType(param) {
	var paramArray = param.split(':');
	return paramArray.every( (item, i, array) => {
		return statuses.indexOf(item) > -1;
	})
} 

function parseParams(param, content) {
	var object = JSON.parse(content);
	var result = [];
	var paramArray = param.split(':');
	for(var key in object.events) {
		paramArray.forEach( (item, i, array) => {
			if(object.events[key].type === item) result.push(object.events[key]);
		})
	}
	return result;
}

function beautifyUptime (sec) {
	var hh = Math.floor(sec / 3600);
	var mm = Math.floor((sec - (hh * 3600)) / 60);
	var ss = sec - (hh * 3600) - (mm * 60);
	ss = Math.round(ss * 100) / 100
	var result = (hh < 10 ? '0' + hh : hh);
	result += ':' + (mm < 10 ? '0' + mm : mm);
	result += ':' + (ss < 10 ? '0' + ss : ss);
	return result;
}