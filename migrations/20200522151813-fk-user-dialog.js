'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'UserDialogs',
        {// name of Source model
      fields: ['dialogId'], // name of the key we're adding

        type: 'foreign key',
        name: 'FK_userDialog',
        references: {
          table: 'Dialogs', // name of Target model
          field: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'NO ACTION',
        onDelete: 'NO ACTION',
      }
    );
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.removeConstraint('UserDialogs', 'FK_userDialog');
  }
};
