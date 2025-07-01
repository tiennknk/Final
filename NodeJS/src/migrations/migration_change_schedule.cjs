'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('schedule', 'currentNumber', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('schedule', 'currentNumber', {
      type: Sequelize.INTEGER,
      defaultValue: null,
    });
  }
};