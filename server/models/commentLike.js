'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class CommentLike extends Model {
        static associate(models) {
            CommentLike.belongsTo(models.Comment, { foreignKey: 'comment_id' });
        }
    }
    CommentLike.init(
        {
            like_comment_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            comment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            like_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'CommentLike',
            tableName: 'comment_likes',
            timestamps: false,
        }
    );
    return CommentLike;
};
