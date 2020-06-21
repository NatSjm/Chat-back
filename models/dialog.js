'use strict';


module.exports = (sequelize, DataTypes) => {
	const Dialog = sequelize.define('Dialog', {
		name: DataTypes.STRING
	}, {});
	Dialog.associate = function(models) {
		Dialog.hasMany(models.Message);
		Dialog.belongsToMany(models.User, {through: 'UserDialogs'});
	};
	return Dialog;
};
