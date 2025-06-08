'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Doctor_Info extends Model {
    static associate(models) {
      Doctor_Info.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctorData' });
      Doctor_Info.belongsTo(models.Specialty, { foreignKey: 'specialtyId', as: 'specialty' });
Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'priceId', targetKey: 'keyMap', as: 'priceTypeData' });
Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'provinceId', targetKey: 'keyMap', as: 'provinceTypeData' });
Doctor_Info.belongsTo(models.Allcode, { foreignKey: 'paymentId', targetKey: 'keyMap', as: 'paymentTypeData' });
    }
  }
  Doctor_Info.init({
    doctorId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    priceId: DataTypes.STRING,
    provinceId: DataTypes.STRING,
    paymentId: DataTypes.STRING,
    addressClinic: DataTypes.STRING,
    nameClinic: DataTypes.STRING,
    note: DataTypes.STRING,
    count: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Doctor_Info',
    freezeTableName: true,
  });
  return Doctor_Info;
};