'use strict';
import express from 'express';
import fs from 'fs';
import conf from './conf';
const statuses = conf.get('statuses');

export default {

	getUptime: (req: express.Request, res: express.Response) => {
		const uptime: number = Math.round(process.uptime());
		res.send(beautifyUptime(uptime));
	},

	eventsGetRequest: (req: express.Request, res: express.Response) => {
		handleRequest(req, res, req.query);
	},

	eventsPostRequest: (req: express.Request, res: express.Response) => {
		handleRequest(req, res, req.body);
	},

};

interface IRequestParam {
	type: string;
	limit: string;
	page: string;
}

function handleRequest(req: express.Request, res: express.Response, paramSource: IRequestParam) {
	if (!Object.keys(paramSource).length) {
		return fs.readFile('./data/events.json', (err: Error, content: Buffer) => {
			if (err) { throw err; }
			return res.send(JSON.parse(content.toString()).events);
		});
	}

	const type = (typeof(paramSource.type) !== 'undefined') ? paramSource.type : '';
	const limit = (typeof(paramSource.limit) !== 'undefined') ? paramSource.limit : '';
	const currentPage = (typeof(paramSource.page) !== 'undefined') ? paramSource.page : '';

	fs.readFile('./data/events.json', (err: Error, content: Buffer) => {

		if (err) { throw err; }
		if (type.length && !validateType(type)) {
			return res.status(400).send('incorrect type');
		}

		let filtered = (type !== '') ? parseParams(type, content.toString()) : JSON.parse(content.toString()).events;

		if (limit.length && currentPage.length) {
			if (Number(limit) <= 0 || Number(currentPage) <= 0) {
				return res.status(400).send('incorrect number of page or limit');
			}
			const total: number = filtered.length;
			const totalPages: number = Math.ceil(total / Number(limit));
			if (Number(currentPage) > totalPages) {
				return res.status(400).send('page number is too big');
			}
			filtered = filtered.slice((Number(currentPage) - 1) * Number(limit), Number(currentPage) * Number(limit));
		}

		return res.send(filtered);
	});
}

function validateType(param: string): boolean {
	const paramArray = param.split(':');
	return paramArray.every( (item, i, array) => {
		return statuses.indexOf(item) > -1;
	});
}

function parseParams(param: string, content: string) {
	const object = JSON.parse(content);
	const result = new Array();
	const paramArray = param.split(':');
	for (const key in object.events) {
		if (object.events.hasOwnProperty(key)) {
			paramArray.forEach( (item, i, array) => {
				if (object.events[key].type === item) { result.push(object.events[key]); }
			});
		}
	}
	return result;
}

function beautifyUptime(sec: number): string | number {
	const hh = Math.floor(sec / 3600);
	const mm = Math.floor((sec - (hh * 3600)) / 60);
	let ss = sec - (hh * 3600) - (mm * 60);
	ss = Math.round(ss * 100) / 100;
	let result: string | number  = (hh < 10 ? '0' + hh : hh);
	result += ':' + (mm < 10 ? '0' + mm : mm);
	result += ':' + (ss < 10 ? '0' + ss : ss);
	return result;
}
