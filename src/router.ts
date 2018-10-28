'use strict';
import express from 'express';
import api from './apiController';

export default (app: express.Application) => {

	app.get('/', (req: express.Request, res: express.Response) => {
		res.render('mainPage');
	});

	app.get('/broadcast', (req: express.Request, res: express.Response) => {
		res.render('video');
	});

	app.get('/status', api.getUptime);

	app.get('/api/events', api.eventsGetRequest);

	app.post('/api/events', api.eventsPostRequest);

	app.use((req: express.Request, res: express.Response) => {
		res.status(404).send('<h1>Page not found</h1>');
	});
};
