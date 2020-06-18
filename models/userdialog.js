'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserDialog = sequelize.define('UserDialog', {
    userId: DataTypes.INTEGER,
    dialogId: DataTypes.INTEGER
  }, {});
  UserDialog.associate = function(models) {
    // associations can be defined here
  };
    return UserDialog;
};