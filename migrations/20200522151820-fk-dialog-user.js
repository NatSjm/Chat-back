'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addConstraint(
      'UserDialogs', // name of Source model
      'userId', // name of the key we're adding 
      {
        type: Sequelize.UUID,
        name: 'FK_dialogUser',
        references: {
          model: 'Users', // name of Target model
          key: 'id', // key in Target model that we're referencing
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
