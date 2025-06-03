'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Allcode extends Model {
    static associate(models) {
      Allcode.hasMany(models.User, { foreignKey: 'positionId', as: 'positionData' });
      Allcode.hasMany(models.User, { foreignKey: 'gender', as: 'genderData' });
      Allcode.hasMany(models.Schedule, { foreignKey: 'timeType', sourceKey: 'keyMap', as: 'timeTypeData' });

      Allcode.hasMany(models.Doctor_Info, { foreignKey: 'priceId', sourceKey: 'keyMap', as: 'priceData' });
      Allcode.hasMany(models.Doctor_Info, { foreignKey: 'provinceId', sourceKey: 'keyMap', as: 'provinceData' });
      Allcode.hasMany(models.Doctor_Info, { foreignKey: 'paymentId', sourceKey: 'keyMap', as: 'paymentData' });
    }
  }
  Allcode.init({
    keyMap: DataTypes.STRING,
    type: DataTypes.STRING,
    valueEn: DataTypes.STRING,
    valueVi: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Allcode',
    tableName: 'allcodes',
    timestamps: true, // Quan trọng: Sequelize sẽ tự quản lý createdAt, updatedAt
  });
  return Allcode;
};