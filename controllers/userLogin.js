const crypto = require('crypto');
const base64url = require('base64url');
const { string: stringValidate } = require('../validators');
const { 
	validate: validateError, 
	model: modelError, 
} = require('../errors');
const { User: UserModel } = require('../models');
const { userLogin: userLoginResponse } = require('../responses');
const redis = require('../redis');

const _generate = (email) => {
	const header = {
		alg: 'HS256',
		typ: 'JWT',
	};
	const payload = {
		email,
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

	return {
		accessToken,
		refreshToken,
	};
};

module.exports = async (req, res) => {
	let { email, password, refreshToken } = req.query;
	let tokens,
		realEmail;

	// parse request data
	try {
		email && (email = stringValidate(email));
		password && (password = stringValidate(password));

		if (refreshToken) {
			refreshToken = stringValidate(refreshToken);
		}
	}
	catch (err) {
		console.log('err', err)

		res.json(validateError(err));
	}

	if (refreshToken) {
		let payloadRefreshToken = {};

		try {
			const splitRefreshToken = refreshToken.split('.');

			payloadRefreshToken = JSON.parse(base64url.decode(splitRefreshToken[1]));
			const cache = await redis().get(`${payloadRefreshToken.email}:refreshToken`);

			if (cache !== refreshToken) {
				return res.json(modelError('user is not auth'));
			}
		}
		catch (err) {
			return res.json(modelError('tokens are not exists'));
		}

		tokens = _generate(payloadRefreshToken.email);
		realEmail = payloadRefreshToken.email;
	}
	else if (email && password) {
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

			tokens = _generate(user.email);
			realEmail = email;
		}
		catch (err) {
			return res.json(modelError(new Error('login data is error')));
		}
	}

	await redis().set(`${realEmail}:accessToken`, tokens.accessToken);
	await redis().set(`${realEmail}:refreshToken`, tokens.refreshToken);

	redis().expire(`${realEmail}:accessToken`, 300000);
	redis().expire(`${realEmail}:refreshToken`, 600000);

	res.cookie('accessToken', tokens.accessToken, {
		maxAge: 300000,
		domain: 'localhost',
	});
	res.cookie('refreshToken', tokens.refreshToken, {
		maxAge: 600000,
		domain: 'localhost',
	});
	res.json(userLoginResponse(tokens));
};

