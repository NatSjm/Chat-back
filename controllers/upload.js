const fs = require('fs');

module.exports = async (req, res) => {
	const { avatar } = req.files;

	fs.rename(avatar.tempFilePath, process.env.TEMP_FILE_DIR +'/'+ 'hello.jpg', (err) => {
		console.log('err', err);
	});

	res.json({ test: true });
};

