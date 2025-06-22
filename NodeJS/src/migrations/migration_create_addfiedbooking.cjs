'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookings', 'email', { type: Sequelize.STRING });
    await queryInterface.addColumn('bookings', 'fullName', { type: Sequelize.STRING });
    await queryInterface.addColumn('bookings', 'selectedGender', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookings', 'email');
    await queryInterface.removeColumn('bookings', 'fullName');
    await queryInterface.removeColumn('bookings', 'selectedGender');
  }
};