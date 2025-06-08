'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.Allcode, { foreignKey: 'timeType', targetKey: 'keyMap', as: 'timeTypeData' });
      Schedule.belongsTo(models.User, { foreignKey: 'doctorId', targetKey: 'id', as: 'doctorData' });
      
    }
  }
  Schedule.init({
    currentNumber: DataTypes.INTEGER,
    maxNumber: DataTypes.INTEGER,
    date: DataTypes.STRING, // Nên là STRING nếu bạn dùng timestamp dạng số
    timeType: DataTypes.STRING,
    doctorId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Schedule',
    tableName: 'schedule'
  });
  return Schedule;
};