const array = (value=[]) => {

	if (value.length <= 0) {
		throw new Error('ArrayIsEmpty');
	}
	return value;
};

module.exports = array;
