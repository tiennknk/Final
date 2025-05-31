'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class History extends Model {
    static associate(models) {
      // define association here
    }
  }
  History.init({
    patientId: DataTypes.INTEGER,
    doctorId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    files: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'History',
  });
  return History;
};