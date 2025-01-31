const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultant_experiences extends Model {
        static associate(models) {
            consultant_experiences.belongsTo(models.consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });
            consultant_experiences.hasMany(models.consultant_images, {
                foreignKey: "consultant_experience_id",
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
        category: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        service: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        experience: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        serviceDescription: {
            type: DataTypes.STRING(410),
            allowNull: false,
        },
        payment_milestones: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        budget: {
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