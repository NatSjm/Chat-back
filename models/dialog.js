'use strict';
module.exports = (sequelize, DataTypes) => {
	const Dialog = sequelize.define('Dialog', {
		name: DataTypes.STRING
	}, {});
	Dialog.associate = function(models) {
		// 
	};
	return Dialog;
};
