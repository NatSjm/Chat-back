const { 
	string: stringValidate,
	number: numberValidate, 
} = require('../validators');
const { 
	validate: validateError, 
	model: modelError, 
} = require('../errors');
const { Message: MessageModel } = require('../models');
const { message: messageResponse } = require('../responses');

module.exports = async (req, res) => {
	let { id } = req.params;
	let { user_id: userId, dialog_id: dialogId, body } = req.body;

	// parse request data
	try {
		id = numberValidate(id);
		userId = numberValidate(userId);
		dialogId = numberValidate(dialogId);
		body = stringValidate(body);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		let step = 0;
		const message = await MessageModel.findOne({
			where: {
				id,
			}
		});

		message.update({ userId, dialogId, body });
		res.json(messageResponse(message));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

