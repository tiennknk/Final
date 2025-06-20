'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'patientId', as: 'patientData' });
      Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' });
    }
  }
  Booking.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    reason: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',        // <-- BẮT BUỘC phải có dòng này!
    timestamps: true              // <-- Nên có
  });
  return Booking;
};