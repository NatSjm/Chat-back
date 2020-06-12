'use strict';
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const controllers = require('./controllers');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const io = require('socket.io')(parseInt(process.env.SOCKET_PORT));
const { auth } = require('./middlewares');

app
	.use(cors())
	.use(cookieParser())
	.use(bodyParser.urlencoded({ extended: true }))
	.use(bodyParser.json())
	.use(bodyParser.raw())
	.use(fileUpload({
		useTempFiles: true,
		tempFileDir: process.env.TEMP_FILE_DIR,
	}))
	.post('/users/', controllers.userCreate)
	.get('/login/', controllers.userLogin)
	.post('/upload', controllers.upload)
	.use(auth)
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
