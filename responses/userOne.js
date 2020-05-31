
const userOne = (modelData = {}, accessToken, refreshToken) => {
	return {
		...modelData.dataValues,
		accessToken,
		refreshToken,
	};
};

module.exports = userOne;

