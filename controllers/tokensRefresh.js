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
	const now = Date.now();
	const { accessToken, refreshToken } = req.cookies;
	let payloadAccessToken,
		payloadRefreshToken,

	// parse request data
	try {
		refreshToken = stringValidate(refreshToken);
		accessToken = stringValidate(accessToken);

		const splitAccessToken = accessToken.split('.');
		const splitRefreshToken = accessToken.split('.');

		payloadAccessToken = JSON.parse(base64url.decode(splitAccessToken[1]));
		payloadRefreshToken = JSON.parse(base64url.decode(splitRefreshToken[1]));
	}
	catch (err) {
		res.json(validateError(err));
	}

	if (payloadAccessToken.email !== payloadRefreshToken.email) {
		return res
			.status(401)
			.json(modelError((new Error('tokens are different'))));
	}

	if (now - 600000 > payloadAccessToken.iat) {
		return res
			.status(401)
			.json(modelError((new Error('access token is expired'))));
	}
};

