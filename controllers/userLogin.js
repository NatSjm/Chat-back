const crypto = require('crypto');
const base64url = require('base64url');
const { string: stringValidate } = require('../validators');
const { 
	validate: validateError, 
	model: modelError, 
} = require('../errors');
const { User: UserModel } = require('../models');
const { userOne: userOneResponse } = require('../responses');

module.exports = async (req, res) => {
	let { email, password } = req.query;

	// parse request data
	try {
		email = stringValidate(email);
		password = stringValidate(password);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		const hash = crypto.createHmac('sha256', process.env.PASSWORD_KEY)
			.update(password)
			.digest('hex');
		const user = await UserModel.findOne({ 
			where: {
				email,
				password: hash,
			}, 
		});
		const header = {
			alg: 'HS256',
			typ: 'JWT',
		};
		const payload = {
			email: user.email,
			iat: Date.now(),
		};

		const open = base64url(JSON.stringify(header)) +'.'+ base64url(JSON.stringify(payload));
		const secretAccessToken = crypto.createHmac('sha256', process.env.ACCESS_TOKEN)
			.update(open)
			.digest('hex');

		const secretRefreshToken = crypto.createHmac('sha256', process.env.REFRESH_TOKEN)
			.update(open)
			.digest('hex');
		const accessToken = open +'.'+ secretAccessToken;
		const refreshToken = open +'.'+ secretRefreshToken;

		res.cookie('accessToken', accessToken);
		res.cookie('refreshToken', refreshToken);
		res.json(userOneResponse(user));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

