const crypto = require('crypto');
const nodemailer = require('nodemailer');
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
		
		const transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: false,
			auth: {
				user: 'testchat91@gmail.com',
				pass: 'helloWORLD+1',
			},
		});
		const info = transporter.sendMail({
			to: 'ihor.bielchenko@gmail.com',
			subject: 'Hello',
			text: 'Example text',
		});
	}
	catch (err) {
		res.json(modelError(err));
	}
};

