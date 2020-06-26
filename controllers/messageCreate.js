const {
	string: stringValidate,
	number: numberValidate,
} = require('../validators');
const {
	validate: validateError,
	model: modelError,
} = require('../errors');
const { Message: MessageModel, User: UserModel} = require('../models');
const { messageOne: messageOneResponse } = require('../responses');

module.exports = (io) => async (req, res) => {
	let { dialog_id: dialogId, body, socketId } = req.body;
	const userEmail = req.userEmail;

	try {
		//userId = numberValidate(userId);
		dialogId = numberValidate(dialogId);
		body = stringValidate(body);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		const user = await UserModel.findOne({
			where: {
				email: userEmail
			},
		});

		const message = await MessageModel.create({
			userId: user.id,
			dialogId,
			body,
		});

		// Object.keys(io.sockets.connected)
		// 	.forEach((key) => {
		// 		const _key = key;
		//
		// 		setTimeout(() => {
		// 			//console.log('_key', _key)
		// 			if (socketId !== _key) {
		// 				io.sockets.connected[_key].emit('messages', messageOneResponse(message));
		// 			}
		// 		}, 0);
		// 	});
		// console.log(socketId);
		// console.log('jjjjj',io.sockets.connected[socketId]);
		io.sockets.connected[socketId].broadcast.to(dialogId).emit('messages', messageOneResponse(message));
		res.json(messageOneResponse(message));
	}
	catch (err) {
		console.log('hhhhhhh', err);
		res.json(modelError(err));
	}
};

