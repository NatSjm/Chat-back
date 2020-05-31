'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const app = express();
const cors = require('cors');
const io = require('socket.io')(parseInt(process.env.SOCKET_PORT));

app
	.use(cors())
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(bodyParser.raw())
	.post('/users/', controllers.userCreate)
	.get('/login/', controllers.userLogin)
	.get('/dialogs/:id', controllers.dialogGetOne)
	.get('/dialogs', controllers.dialogGetMany)
	.post('/dialogs', controllers.dialogCreate)
	.patch('/dialogs/:id', controllers.dialogUpdate)
	.delete('/dialogs/:id', controllers.dialogDelete)
	.post('/messages/', controllers.messageCreate(io))
	.patch('/messages/:id', controllers.messageUpdate)
	.delete('/messages/:id', controllers.messageDelete)
	.get('/users/:id', controllers.userGetOne)
	.get('/users/', controllers.userGetMany);

app.listen(parseInt(process.env.HTTP_PORT));

io.on('connection', (socket) => {
	setTimeout(async () => {
		socket.on('messages', controllers.messageGetMany(socket));
	}, 0);
});
