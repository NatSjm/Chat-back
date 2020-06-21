const { model: modelError } = require('../errors');
const { Dialog: DialogModel, User: UserModel } = require('../models');
const { dialogMany: dialogManyResponse } = require('../responses');

module.exports = async (req, res) => {
	//console.log('req.sessionID', req.session);
    const userEmail =  req.userEmail;
	// query to db
	try {
		const user = await UserModel.findOne({
			where: {
				email: userEmail
			},
		});
		const  items = await user.getDialogs(
			{
				 order: [['updatedAt', 'DESC']]
			}
		);
		res.json(dialogManyResponse(items));
	}
	catch (err) {
		res.json(modelError(err));
	}
};

