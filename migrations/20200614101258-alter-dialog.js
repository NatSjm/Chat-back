'use strict';

module.exports = {
    //Добавление поля avatar в таблицу Dialogs
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn('Dialogs', 'avatar', Sequelize.STRING);
    },

    //Удаление поля avatar из таблицы Dialogs
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn('Dialogs', 'avatar');
    }
};
