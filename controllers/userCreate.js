const crypto = require('crypto');
const { string: stringValidate } = require('../validators');
const { 
	validate: validateError, 
	model: modelError, 
} = require('../errors');
const { User: UserModel } = require('../models');
const { userOne: userOneResponse } = require('../responses');

module.exports = async (req, res) => {
	let { name, email, password, confirm_password } = req.body;

	// parse request data
	try {
		name = stringValidate(name);
		email = stringValidate(email);
		password = stringValidate(password);

		if (password !== confirm_password) {
			throw new Error('not equal passwords');
		}
	}
	catch (err) {
		res.json(validateError(err));
	}


	// query to db
	try {
		const hash = crypto.createHmac('sha256', process.env.PASSWORD_KEY)
			.update(password)
			.digest('hex');

		const user = await UserModel.create({ 
			name, 
			email, 
			password: hash, 
		});

		res.json(userOneResponse(user));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

