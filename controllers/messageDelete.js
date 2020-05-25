const { number: numberValidate } = require('../validators');
const { 
	validate: validateError, 
	model: modelError, 
} = require('../errors');
const { Message: MessageModel } = require('../models');
const { destroy: destroyResponse } = require('../responses');

module.exports = async (req, res) => {
	let { id } = req.params;

	// parse request data
	try {
		id = numberValidate(id);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		const message = await MessageModel.findOne({
			where: {
				id,
			}
		});

		message.destroy();
		res.json(destroyResponse());
	}
	catch (err) {
		res.json(modelError(err));
	}
};

