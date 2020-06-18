const {
	string: stringValidate,
	array: arrayValidate,
} = require('../validators');
const {
	validate: validateError,
	model: modelError,
} = require('../errors');
const {
	Dialog: DialogModel,
	UserDialog: UserDialogModel,
} = require('../models');
const { dialogOne: dialogOneResponse } = require('../responses');

module.exports = (io) => async (req, res) => {
	let { name, users, socketId } = req.body;

	// parse request data
	try {
		name = stringValidate(name);
		users = arrayValidate(users);
	}
	catch (err) {
		return res.status(400).json(validateError(err));
	}

	// query to db
	try {
		const dialog = await DialogModel.create({ name });



		Object.keys(io.sockets.connected)
			.forEach((key) => {
				const _key = key;

				setTimeout(() => {
					if (socketId !== _key) {
						io.sockets.connected[_key].emit('dialogs', dialogOneResponse(dialog));
					}
				}, 0);
			});



		users.forEach((id, i) => {
			const _id = id;
			setTimeout(() => {
				UserDialogModel.create({
					dialogId: dialog.id,
					userId: _id,
				});
			}, 0);
		});


		res.json(dialogOneResponse(dialog, users));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

