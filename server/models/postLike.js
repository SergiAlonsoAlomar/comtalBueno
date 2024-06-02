// 'use strict';
// const { Model, DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//     class PostLike extends Model {
//         static associate(models) {
//             PostLike.belongsTo(models.User, { foreignKey: 'username' });
//         }
//     }

//     PostLike.init(
//         {
//             like_post_id: {
//                 type: DataTypes.INTEGER,
//                 primaryKey: true,
//                 autoIncrement: true
//             },
//             post_id: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false
//             },
//             username: {
//                 type: DataTypes.STRING,
//                 allowNull: false
//             },
//             like_datetime: {
//                 type: DataTypes.DATE,
//                 allowNull: false,
//                 defaultValue: DataTypes.NOW
//             }
//         },
//         {
//             sequelize, // Pasar sequelize aquí
//             modelName: 'PostLike',
//             tableName: 'post_likes',
//             timestamps: false
//         }
//     );
//     return PostLike;
// };

// models/Like.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class PostLike extends Model { }

    PostLike.init(
        {
            like_post_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            post_id: {
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
            },
        },
        {
            sequelize,
            modelName: 'PostLike',
            tableName: 'post_likes',
            timestamps: false,
        }
    );

    return PostLike;
};
