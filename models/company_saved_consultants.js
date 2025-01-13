
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class company_saved_consultants extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            company_saved_consultants.belongsTo(models.consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            company_saved_consultants.belongsTo(models.companies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });
        }
    };

    company_saved_consultants.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        consultant_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "consultants", key: "id" }
        },
        company_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
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
        modelName: 'company_saved_consultants',
    });
    return company_saved_consultants;
};