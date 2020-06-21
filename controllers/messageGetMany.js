const { number: numberValidate } = require('../validators');
const { model: modelError } = require('../errors');
const { Message: MessageModel } = require('../models');
const { messageMany: messageManyResponse } = require('../responses');

module.exports = (socket) => async (msg) => {
	let { dialogId } = msg;

	// parse request data
	try {
		dialogId = numberValidate(dialogId);
	}
	catch (err) {
		socket.emit('error', validateError(err));
	}

	// query to db
	try {
		const items = await MessageModel.findAll({
			where: {
				dialogId,
			},
		});
		//console.log(socket.rooms);
		Object.keys(socket.rooms).filter((r) => r != socket.id)
			.forEach((r) => socket.leave(r));
		setTimeout(() => {
			socket.join(dialogId);
		});

		socket.emit('messages', messageManyResponse(items));
	}
	catch (err) {
		socket.emit('error', modelError(err));
	}

	return {};
};

