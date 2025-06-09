'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Clinic extends Model {
    static associate(models) {
      // define association here
    }
  }
  Clinic.init({
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    descriptionMarkdown: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
    image: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Clinic',
  });
  return Clinic;
};