'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const app = express();

app
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(bodyParser.raw())
	.get('/dialogs/:id', controllers.dialogGetOne)
	.post('/dialogs', controllers.dialogCreate)
	.patch('/dialogs/:id', controllers.dialogUpdate)
	.delete('/dialogs/:id', controllers.dialogDelete)
	.post('/messages/', controllers.messageCreate)
	.patch('/messages/:id', controllers.messageUpdate)
	.delete('/messages/:id', controllers.messageDelete)
	.get('/users/:id', controllers.userGetOne)
	.get('/users/', controllers.userGetMany);

app.listen(4444);
