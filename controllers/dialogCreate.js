const { 
	string: stringValidate,
	json: jsonValidate, 
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

module.exports = async (req, res) => {
	let { name, users } = req.body;

	// parse request data
	try {
		name = stringValidate(name);
		users = jsonValidate(users);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		const dialog = await DialogModel.create({ name });

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

