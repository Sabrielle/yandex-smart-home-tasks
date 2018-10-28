'use strict';

import conf from './conf';
import bodyParser from 'body-parser';
import express from 'express';
import router from './router';
const app = express();

app.use('/public', express.static( __dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './../views');
app.set('view engine', 'pug');

router(app);

app.listen(conf.get('server:port'), () => {
	console.log('Server listening on port ' + conf.get('server:port'));
});
