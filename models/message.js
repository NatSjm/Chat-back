'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    userId: DataTypes.INTEGER,
    dialogId: DataTypes.INTEGER,
    body: DataTypes.TEXT
  }, {});
  Message.associate = function(models) {
    Message.belongsTo(models.Dialog);
  };
  Message.addHook('afterCreate', (message) => {
    const messageCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');
    sequelize.query(`UPDATE dialogs SET updatedAt = "${messageCreated}" WHERE id = "${message.dialogId}"`);
  });

  return Message;
};
