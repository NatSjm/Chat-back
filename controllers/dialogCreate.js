const {Op} = require("sequelize");
const redis = require('../redis');
const {
	string: stringValidate,
	array: arrayValidate,
} = require('../validators');
const {
	validate: validateError,
	model: modelError,
} = require('../errors');
const {
	Dialog: DialogModel,
	UserDialog: UserDialogModel,
	User: UserModel
} = require('../models');
const {dialogOne: dialogOneResponse} = require('../responses');

module.exports = (io) => async (req, res) => {
	let {name, users, socketId} = req.body;
	const userEmail = req.userEmail;
	const emails = [];
	const socketIds = [];

	// parse request data
	try {
		name = stringValidate(name);
		users = arrayValidate(users);
	} catch (err) {
		return res.status(400).json(validateError(err));
	}

	// query to db
	try {
		const dialog = await DialogModel.create({name});


		//get array of objects
		const userEmails = await UserModel.findAll({
			attributes: ['email'],
			where: {
				id: {
					[Op.or]: [...users]
				}
			},
			raw: true
		});
		//array of emails
		userEmails.map((el) => {
			emails.push(el['email']);
		});
		//all but user emails
		const otherEmails = emails.filter((email) => (email != userEmail));
		//array of socketIds
		await Promise.all(otherEmails.map(async (email) => {
			let socket = await redis().get(`${email}:socketId`);
			if (socket) {
				socketIds.push(socket);
			}
		}));
		if(socketIds.length > 0) {
			socketIds.forEach((key) => {
				const _key = key;
				setTimeout(() => {
					io.sockets.connected[_key].emit('dialogs', dialogOneResponse(dialog));
				}, 0);
			});
		}
		users.forEach((id, i) => {
			const _id = id;
			setTimeout(() => {
				UserDialogModel.create({
					dialogId: dialog.id,
					userId: _id,
				});
			}, 0);
		});


		res.json(dialogOneResponse(dialog, users));
	} catch (err) {
		res.json(modelError(err));
	}
};

