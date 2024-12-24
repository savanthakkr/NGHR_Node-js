const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultant_certificates extends Model {
        static associate(models) {
            consultant_certificates.belongsTo(models.consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });
        }
    }
    consultant_certificates.init({
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
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        documents: {
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
        modelName: 'consultant_certificates',
    })

    return consultant_certificates
}