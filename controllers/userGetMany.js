const { model: modelError } = require('../errors');
const { User: UserModel } = require('../models');
const { userMany: userManyResponse } = require('../responses');

module.exports = async (req, res) => {
	// query to db
	try {
		const items = await UserModel.findAll({
			attributes: {
				exclude: [ 'password' ]
			}
		});

		res.json(userManyResponse(items));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

