
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class connections extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            connections.belongsTo(models.users, {
                foreignKey: 'sender_user_id',
                as: 'senderUser',
            });

            connections.belongsTo(models.users, {
                foreignKey: 'receiver_user_id',
                as: 'receiverUser',
            });

            connections.belongsTo(models.companies, {
                foreignKey: 'sender_company_id',
                as: 'senderCompany',
            });

            connections.belongsTo(models.companies, {
                foreignKey: 'receiver_company_id',
                as: 'receiverCompany',
            });
        }
    };

    connections.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        sender_user_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
        },
        receiver_user_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
        },
        sender_company_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        receiver_company_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        from: {
            allowNull: false,
            type: DataTypes.ENUM('user', 'company'),
            comment: 'Indicates the type of sender (user or company)'
        },
        to: {
            allowNull: false,
            type: DataTypes.ENUM('user', 'company'),
            comment: 'Indicates the type of receiver (user or company)'
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
        modelName: 'connections',
    });
    return connections;
};