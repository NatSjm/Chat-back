const { 
	number: numberValidate,
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
const { destroy: destroyResponse } = require('../responses');

module.exports = async (req, res) => {
	let { id } = req.params;

	// parse request data
	try {
		id = numberValidate(id);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		const dialog = await DialogModel.findOne({
			where: {
				id,
			}
		});
		const links = await UserDialogModel.findAll({
			where: {
				dialogId: id,
			}
		}) || [];

		links.forEach((link, i) => {
			link.destroy();
		});
		dialog.destroy();

		res.json(destroyResponse());
	}
	catch (err) {
		res.json(modelError(err));
	}
};

