// 'use strict';
// const { Model } = require('sequelize');

// module.exports = (sequelize, DataTypes) => {
//     class User extends Model {
//         static associate(models) {
//             User.hasMany(models.Post, { foreignKey: 'username' });
//         }
//     }
//     User.init(
//         {
//             username: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 unique: true,
//                 primaryKey: true,
//             },
//             email: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 unique: true,
//             },
//             password: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             birth_date: {
//                 type: DataTypes.DATE,
//                 allowNull: false,
//             },
//             first_name: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             last_name: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//             },
//             public_account: {
//                 type: DataTypes.BOOLEAN,
//                 allowNull: false,
//             },
//         },
//         {
//             sequelize,
//             modelName: 'User',
//             timestamps: false,
//         }
//     );
//     return User;
// };

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Model {
        static associate(models) {
            User.hasMany(models.Friendship, { foreignKey: 'requesting_user', as: 'RequestedFriendships' });
            User.hasMany(models.Friendship, { foreignKey: 'receiving_user', as: 'ReceivedFriendships' });
        }
    }
    User.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            birth_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            first_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            last_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            public_account: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            }
        },
        {
            sequelize,
            modelName: 'User',
            timestamps: false,
        }
    );
    return User;
};
