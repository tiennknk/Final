'use strict';

import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Markdown extends Model {
        static associate(models) {
            // define association here
        }
    }

    Markdown.init({
        contentHTML: DataTypes.TEXT('long'),
        contentMarkdown: DataTypes.TEXT('long'),
        description: DataTypes.TEXT('long'),
        doctorId: DataTypes.INTEGER,
        specialtyId: DataTypes.INTEGER,
        clinicId: DataTypes.INTEGER,
    }, {
        sequelize,
        modelName: 'Markdown',
        tableName: 'markdown',
        freezeTableName: true
    });
    return Markdown;
}