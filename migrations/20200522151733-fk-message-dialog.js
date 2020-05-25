'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'Messages',
        {// name of Source model
      fields: ['dialogId'], // name of the key we're adding

        type: 'foreign key',
        name: 'FK_messageDialog',
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
