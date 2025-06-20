'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Review extends Model {
    static associate(models) {
      // Đánh giá cho bác sĩ (User) - doctorId
      Review.belongsTo(models.User, { foreignKey: 'doctorId', as: 'doctor' });
      // Đánh giá cho bệnh nhân (User) - patientId
      Review.belongsTo(models.User, { foreignKey: 'patientId', as: 'patient' });
      // Đánh giá cho phòng khám (Clinic)
      Review.belongsTo(models.Clinic, { foreignKey: 'clinicId', as: 'clinic' });
    }
  }
  Review.init({
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    clinicId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 }
    },
    comment: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
  });
  return Review;
};