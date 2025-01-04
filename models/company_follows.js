
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class company_follows extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            company_follows.belongsTo(models.companies, {
                foreignKey: "sender_id",
                onDelete: 'cascade',
                as: 'companyFollowsAsSender'
            });

            company_follows.belongsTo(models.users, {
                foreignKey: "receiver_id",
                onDelete: 'cascade',
                as: 'companyFollowsAsReceiver'
            });
        }
    };

    company_follows.init({
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
        modelName: 'company_follows',
    });
    return company_follows;
};