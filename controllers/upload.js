const fs = require('fs');
const {
	Dialog: DialogModel,
} = require('../models');

module.exports = async (req, res) => {
	const { avatar } = req.files;

	fs.rename(avatar.tempFilePath, process.env.TEMP_FILE_DIR +'/'+ 'hello.jpg', (err) => {
		console.log('err', err);
	});
	const dialog = await DialogModel.findOne({
		where: {
			id,
		}
	});

	res.json({ test: true });
};

