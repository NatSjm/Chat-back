const { number: numberValidate } = require('../validators');
const { 
	validate: validateError, 
	model: modelError, 
} = require('../errors');
const { Dialog: DialogModel } = require('../models');
const { dialog: dialogResponse } = require('../responses');

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
		const item = await DialogModel.findOne({ 
			where: {
				id
			}, 
		});

		res.json(dialogResponse(item));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

