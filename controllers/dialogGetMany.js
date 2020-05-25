const { model: modelError } = require('../errors');
const { Dialog: DialogModel } = require('../models');
const { dialogMany: userManyResponse } = require('../responses');

module.exports = async (req, res) => {
	// query to db
	try {
		const items = await DialogModel.findAll();

		res.json(userManyResponse(items));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

