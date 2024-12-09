const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class companies extends Model {
        static associate(models) {
        }
    }
    companies.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        full_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        aadhar_front: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        aadhar_back: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        aadhar_card_number: {
            type: DataTypes.STRING(12),
            allowNull: true,
        },
        pan_card: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        pan_card_number: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        company_type: {
            type: DataTypes.STRING(255),
            allowNull: true,
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
        modelName: 'companies',
    })

    return companies
}