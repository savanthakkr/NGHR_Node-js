const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultants extends Model {
        static associate(models) {
            consultants.hasMany(models.consultant_experiences, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.consultant_projects, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.consultant_certificates, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasOne(models.user_tokens, {
                foreignKey: "consultant_user_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.company_saved_consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });
        }
    }
    consultants.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        full_name: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING(255),
            set(val) {
                this.setDataValue('email', val.toLowerCase())
            }
        },
        phone_number: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        current_location: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        profile_image: {
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
        modelName: 'consultants',
    })

    return consultants
}