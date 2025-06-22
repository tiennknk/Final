'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate(models) {
      Booking.belongsTo(models.User, { foreignKey: 'patientId', as: 'patientData' });
      Booking.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
      Booking.belongsTo(models.Specialty, { foreignKey: 'specialtyId', as: 'specialtyData' });
      Booking.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinicData' });
      Booking.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeDataPatient' });
      Booking.belongsTo(models.Doctor_Info, { foreignKey: 'doctorId', targetKey: 'doctorId', as: 'doctorInfoBooking' });
    }
  }
  Booking.init({
    statusId: DataTypes.STRING,
    doctorId: DataTypes.INTEGER,
    patientId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    date: DataTypes.STRING,
    timeType: DataTypes.STRING,
    token: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    reason: DataTypes.STRING,
    // Các trường cho đặt lịch nâng cao & thanh toán
    bookerId: DataTypes.INTEGER,
    bookingCode: DataTypes.STRING,
    paymentStatus: DataTypes.STRING,
    paymentMethod: DataTypes.STRING,
    email: DataTypes.STRING,
    fullName: DataTypes.STRING,
    selectedGender: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true
  });
  return Booking;
};