const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultant_projects extends Model {
        static associate(models) {
            consultant_projects.belongsTo(models.consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultant_projects.hasMany(models.consultant_images, {
                foreignKey: "consultant_project_id",
                onDelete: 'cascade'
            });
        }
    }
    consultant_projects.init({
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
        company_key_skill: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        project_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        organization: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        start_date: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        end_date: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        testimonials: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        payment_type: {
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
        modelName: 'consultant_projects',
    })

    return consultant_projects
}