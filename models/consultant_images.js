const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultant_images extends Model {
        static associate(models) {
            consultant_images.belongsTo(models.consultant_projects, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });
        }
    }
    consultant_images.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        consultant_project_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "consultant_projects", key: "id" }
        },
        images: {
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
        modelName: 'consultant_images',
    })

    return consultant_images
}