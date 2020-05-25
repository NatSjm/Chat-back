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

module.exports = async (req, res) => {
	let { user_id: userId, dialog_id: dialogId, body } = req.body;

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

		res.json(messageOneResponse(message));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

