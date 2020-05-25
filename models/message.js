'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    userId: DataTypes.INTEGER,
    dialogId: DataTypes.INTEGER,
    body: DataTypes.TEXT
  }, {});
  Message.associate = function(models) {
    // associations can be defined here
  };
  return Message;
};