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

            consultants.hasMany(models.consultant_follows, {
                foreignKey: "sender_id",
                onDelete: 'cascade',
                as: 'consultantsFollowsAsSender'
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