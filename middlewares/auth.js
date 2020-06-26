const base64url = require('base64url');
const { model: modelError } = require('../errors');
const redis = require('../redis');

const auth = async (req, res, next) => {
	const now = Date.now();
	const { accessToken } = req.query;

	if (!accessToken) {
		return res
			.status(401)
			.json(modelError((new Error('access token is empty'))));
	}

	const split = accessToken.split('.');
	const payload = JSON.parse(base64url.decode(split[1]));

	if (now - 300000 > payload.iat) {
		return res
			.status(401)
			.json(modelError((new Error('access token is expired'))));
	}

	if (await redis().get(`${payload.email}:accessToken`) === accessToken) {
		req['userEmail'] = payload.email;
		return next();
	}

	return res
		.status(401)
		.json(modelError((new Error('access token is error'))));
};

module.exports = auth;
