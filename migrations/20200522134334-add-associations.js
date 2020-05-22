'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
        'Messages',
        'DialogId',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'Dialogs',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }
    )
        .then(() => {
          return queryInterface.addColumn(
              'Messages',
              'UserId',
              {
                type: Sequelize.INTEGER,
                references: {
                  model: 'Users',
                  key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
              }
          )
        });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
        'Messages',
        'DialogId'
    )
        .then(() => {
          return queryInterface.removeColumn(
              'Messages',
              'UserId'
          )
        });
  }
};
