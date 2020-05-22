'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
        'UserDialogs',
        {
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          UserId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
          },
          TagId: {
            type: Sequelize.INTEGER,
            primaryKey: true,
          },
        }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('UserDialogs');
  }
};
