// 'use strict';
// const { Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//     class Post extends Model {
//         static associate(models) {
//             Post.belongsTo(models.User, { foreignKey: 'username' });
//         }
//     }
//     Post.init(
//         {
//             post_id: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true,
//             },
//             username: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             message: {
//                 type: DataTypes.STRING(250), // Limitar a 250 caracteres
//                 allowNull: false,
//             },
//             post_datetime: {
//                 type: DataTypes.DATE,
//                 allowNull: false,
//                 defaultValue: DataTypes.NOW,
//             }
//         },
//         {
//             sequelize,
//             modelName: 'Post',
//             timestamps: false,
//         }
//     );
//     return Post;
// };

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, { foreignKey: 'username' });
        }
    }
    Post.init(
        {
            post_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            message: {
                type: DataTypes.STRING(250), // Limitar a 250 caracteres
                allowNull: false,
            },
            post_datetime: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'Post',
            timestamps: false,
        }
    );
    return Post;
};
