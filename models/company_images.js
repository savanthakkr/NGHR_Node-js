
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class company_images extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            company_images.belongsTo(models.companies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });
        }
    };

    company_images.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        company_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        image: {
            type: DataTypes.STRING(350),
            allowNull: true
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
        modelName: 'company_images',
    });
    return company_images;
};