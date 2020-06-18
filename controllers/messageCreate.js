const {
	string: stringValidate,
	number: numberValidate,
} = require('../validators');
const {
	validate: validateError,
	model: modelError,
} = require('../errors');
const { Message: MessageModel } = require('../models');
const { messageOne: messageOneResponse } = require('../responses');

module.exports = (io) => async (req, res) => {
	let { user_id: userId, dialog_id: dialogId, body, id } = req.body;
	// parse request data
	try {
		userId = numberValidate(userId);
		dialogId = numberValidate(dialogId);
		body = stringValidate(body);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		const message = await MessageModel.create({
			userId,
			dialogId,
			body,
		});

		Object.keys(io.sockets.connected)
			.forEach((key) => {
				const _key = key;

				setTimeout(() => {
					//console.log('_key', _key)
					if (id !== _key) {
						io.sockets.connected[_key].emit('messages', messageOneResponse(message));
					}
				}, 0);
			});
		res.json(messageOneResponse(message));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

