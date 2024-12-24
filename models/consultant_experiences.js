const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultant_experiences extends Model {
        static associate(models) {
            consultant_experiences.belongsTo(models.consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });
        }
    }
    consultant_experiences.init({
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
        consultant_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        area_of_expertise: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        experience: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        employment_type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        key_skill: {
            type: DataTypes.STRING(255),
            allowNull: false,
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
        modelName: 'consultant_experiences',
    })

    return consultant_experiences
}