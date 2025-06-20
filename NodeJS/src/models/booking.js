'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'patientId', as: 'patientData' });
      // Bác sĩ
      Booking.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
      // Chuyên khoa
      Booking.belongsTo(models.Specialty, { foreignKey: 'specialtyId', as: 'specialtyData' });
      // Phòng khám
      Booking.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinicData' });
      // Mã thời gian
      Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' });
      // Có thể thêm các association khác nếu cần
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