'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Allcode, { foreignKey: 'positionId', targetKey: 'keyMap', as: 'positionData' });
      User.belongsTo(models.Allcode, { foreignKey: 'gender', targetKey: 'keyMap', as: 'genderData' });
      User.hasOne(models.Markdown, { foreignKey: 'doctorId' });
      User.hasOne(models.Doctor_Info, { foreignKey: 'doctorId' });
      User.hasMany(models.Schedule, { foreignKey: 'doctorId', as: 'doctorData' });
    }
  }
  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phonenumber: DataTypes.STRING,
    gender: DataTypes.STRING,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};