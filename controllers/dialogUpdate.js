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
const { dialogOne: dialogOneResponse } = require('../responses');

module.exports = async (req, res) => {
	let { id } = req.params;
	let { name, users } = req.body;

	// parse request data
	try {
		id = numberValidate(id);
		name = stringValidate(name);
		users = jsonValidate(users);
	}
	catch (err) {
		res.json(validateError(err));
	}

	// query to db
	try {
		let step = 0;
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
		dialog.update({ name });

		users.forEach((id, i) => {
			step++;
			const _id = id;
			const _i = i;

			setTimeout(() => {
				let item = links[_i];

				if (!item) {
					UserDialogModel.create({ 
						dialogId: dialog.id,
						userId: _id,
					});
				}
				else {
					item.update({
						userId: _id,
					});
				}
			}, 0);
		});

		while (step < links.length) {
			links[step].destroy();
			step++;
		}

		res.json(dialogOneResponse(dialog, users));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

