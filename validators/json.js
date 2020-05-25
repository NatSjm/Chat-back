
const json = (value = '') => {
	value = JSON.parse(value);

	if (!Array.isArray(value)) {
		throw new Error('isNotArray');
	}
	return value;
};

module.exports = json;
