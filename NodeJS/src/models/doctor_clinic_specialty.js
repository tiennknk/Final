'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Doctor_clinic_specialty extends Model {
    static associate(models) {
      // define association here
    }
  }
  Doctor_clinic_specialty.init({
    doctorId: DataTypes.INTEGER,
    clinicId: DataTypes.INTEGER,
    specialtyId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Doctor_clinic_specialty',
  });
  return Doctor_clinic_specialty;
};