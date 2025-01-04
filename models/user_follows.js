
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_follows extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_follows.belongsTo(models.users, {
                foreignKey: "sender_id",
                onDelete: 'cascade',
                as: 'userFollowsAsSender'
            });

            user_follows.belongsTo(models.users, {
                foreignKey: "receiver_id",
                onDelete: 'cascade',
                as: 'userFollowsAsReceiver'
            });
        }
    };

    user_follows.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        sender_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        receiver_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
        },
        status: {
            allowNull: false,
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            comment: '0 => requested, 1 => accepted, 2 => rejected'
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    }, {
        sequelize,
        modelName: 'user_follows',
    });
    return user_follows;
};