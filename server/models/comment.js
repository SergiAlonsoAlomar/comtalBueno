'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Comment extends Model {
        static associate(models) {
            Comment.belongsTo(models.User, { foreignKey: 'username' });
        }
    }

    Comment.init(
        {
            comment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false
            },
            comment_text: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            comment_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize, // Pasar sequelize aquí
            modelName: 'Comment',
            tableName: 'comments',
            timestamps: false
        }
    );
    return Comment;
};