'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Specialty extends Model {
    static associate(models) {
      // define association here
    }
  }
  Specialty.init({
    name: DataTypes.STRING,
    descriptionMarkdown: DataTypes.TEXT,
    descriptionHTML: DataTypes.TEXT,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Specialty',
  });
  return Specialty;
};