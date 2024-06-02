// 'use strict';
// const { Model, DataTypes } = require('sequelize');

// module.exports = (sequelize) => {
//     class Friendship extends Model {
//         static associate(models) {
//             // Define las asociaciones aquí si es necesario
//         }
//     }
//     Friendship.init(
//         {
//             friendship_id: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             requesting_user: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 references: {
//                     model: 'users',
//                     key: 'username'
//                 }
//             },
//             receiving_user: {
//                 type: DataTypes.STRING,
//                 allowNull: false,
//                 references: {
//                     model: 'users',
//                     key: 'username'
//                 }
//             },
//             friendship_status: {
//                 type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
//                 allowNull: false
//             }
//         },
//         {
//             sequelize,
//             modelName: 'Friendship',
//             tableName: 'friendships',
//             timestamps: false // Si no necesitas timestamps, puedes deshabilitarlos
//         }
//     );
//     return Friendship;
// };

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Friendship extends Model {
        static associate(models) {
            Friendship.belongsTo(models.User, { foreignKey: 'requesting_user', as: 'RequestingUser' });
            Friendship.belongsTo(models.User, { foreignKey: 'receiving_user', as: 'ReceivingUser' });
        }
    }
    Friendship.init(
        {
            friendship_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            requesting_user: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            receiving_user: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            friendship_status: {
                type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'Friendship',
            tableName: 'friendships',
            timestamps: false // Si no necesitas timestamps, puedes deshabilitarlos
        }
    );
    return Friendship;
};
