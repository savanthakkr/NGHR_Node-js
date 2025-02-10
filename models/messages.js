
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class messages extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            messages.belongsTo(models.users, {
                foreignKey: 'sender_user_id',
                as: 'messageSenderUser',
            });

            messages.belongsTo(models.users, {
                foreignKey: 'receiver_user_id',
                as: 'messageReceiverUser',
            });

            messages.belongsTo(models.companies, {
                foreignKey: 'sender_company_id',
                as: 'messageSenderCompany',
            });

            messages.belongsTo(models.companies, {
                foreignKey: 'receiver_company_id',
                as: 'messageReceiverCompany',
            });

            messages.belongsTo(models.consultants, {
                foreignKey: 'sender_consultant_id',
                as: 'messageSenderConsultant',
            });

            messages.belongsTo(models.consultants, {
                foreignKey: 'receiver_consultant_id',
                as: 'messageReceiverConsultant',
            });
        }
    };

    messages.init({
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
        sender_consultant_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "consultants", key: "id" }
        },
        receiver_consultant_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "consultants", key: "id" }
        },
        room_id: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },
        message: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        is_read: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0,
            comment: " 0 => not read 1 => read "
        },
        from: {
            allowNull: false,
            type: DataTypes.ENUM('user', 'company', 'consultant'),
            comment: 'Indicates the type of sender (user, company or consultant)'
        },
        to: {
            allowNull: false,
            type: DataTypes.ENUM('user', 'company', 'consultant'),
            comment: 'Indicates the type of receiver (user, company or consultant)'
        },
        status: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0,
            comment: " 0 => Inactive 1 => Active "
        },
        is_delete: {
            type: DataTypes.TINYINT(1),
            allowNull: false,
            defaultValue: 0,
            Comment: " 0 => Not deleted 1 => Deleted "
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
        modelName: 'messages',
    });
    return messages;
};