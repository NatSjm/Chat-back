const { number: numberValidate } = require('../validators');
const { model: modelError } = require('../errors');
const { Message: MessageModel } = require('../models');
const { messageMany: messageManyResponse } = require('../responses');

module.exports = async (req, res) => {
	let { dialog_id: dialogId } = req.query;

	// parse request data
	try {
		dialogId = numberValidate(dialogId);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		const items = await MessageModel.findAll({
			where: {
				dialogId,
			},
		});

		res.json(messageManyResponse(items));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

