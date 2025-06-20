'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookings', 'address', Sequelize.STRING);
    
    await queryInterface.addColumn('bookings', 'phoneNumber', Sequelize.STRING);
    await queryInterface.addColumn('bookings', 'reason', Sequelize.STRING);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookings', 'address');
    
    await queryInterface.removeColumn('bookings', 'phoneNumber');
    await queryInterface.removeColumn('bookings', 'reason');
  }
};