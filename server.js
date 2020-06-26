'use strict';
require('dotenv').config();

const base64url = require('base64url');
const redis = require('./redis');

const schedule = require('node-schedule');
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
	.post('/dialogs', controllers.dialogCreate(io))
	.patch('/dialogs/:id', controllers.dialogUpdate)
	.delete('/dialogs/:id', controllers.dialogDelete)
	.post('/messages/', controllers.messageCreate(io))
	.patch('/messages/:id', controllers.messageUpdate)
	.delete('/messages/:id', controllers.messageDelete)
	.get('/users/:id', controllers.userGetOne)
	.get('/users/', controllers.userGetMany);

app.listen(parseInt(process.env.HTTP_PORT), () => {
	redis().keys('*:socketId').then(function (keys) {
		let pipeline = redis().pipeline();
		keys.forEach(function (key) {
			pipeline.del(key);
		});
		return pipeline.exec();
	});
	redis().keys('socket_*').then(function (keys) {
		let pipeline = redis().pipeline();
		keys.forEach(function (key) {
			pipeline.del(key);
		});
		return pipeline.exec();
	});
});

io.on('connect', (socket) => {
	setTimeout(async () => {
		socket.on('messages', controllers.messageGetMany(socket));
	}, 0);
	setTimeout(async () => {
		socket.on('userConnected', (data) => redisSetter(data, socket.id));
	}, 0);
	setTimeout(async () => {
		socket.on('disconnect', () => redisRemover(socket.id));
	}, 0);

});




// schedule.scheduleJob('* * * * *', () => {
// 	console.log('CRON!')
// });
const redisSetter = async ({accessToken}, socketId) => {
	//console.log(accessToken, socketId);
	if (accessToken && socketId) {
		const split = accessToken.split('.');
		const payload = JSON.parse(base64url.decode(split[1]));
		const userEmail = payload.email;
		 redis().set(`${userEmail}:socketId`, socketId);
		 redis().set(`socket_${socketId}`, userEmail);
	}else{
		console.log('no accessTocken or socketId');
	}
};

const redisRemover = async(socketId) => {
	let userEmail =  await redis().get(`socket_${socketId}`);
	await redis().del(`${userEmail}:socketId`);
	await redis().del(`socket_${socketId}`);
	//console.log('done');
};



