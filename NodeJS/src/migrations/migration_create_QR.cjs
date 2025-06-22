'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('bookings', 'bookerId', { type: Sequelize.INTEGER });
    await queryInterface.addColumn('bookings', 'bookingCode', { type: Sequelize.STRING });
    await queryInterface.addColumn('bookings', 'paymentStatus', { type: Sequelize.STRING });
    await queryInterface.addColumn('bookings', 'paymentMethod', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('bookings', 'bookerId');
    await queryInterface.removeColumn('bookings', 'bookingCode');
    await queryInterface.removeColumn('bookings', 'paymentStatus');
    await queryInterface.removeColumn('bookings', 'paymentMethod');
  }
};