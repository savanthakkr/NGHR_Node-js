const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
            users.hasOne(models.user_tokens, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasMany(models.user_documents, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });
        }
    }
    users.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        name: {
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
        mobile: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            allowNull: false,
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            comment: "0 => not active, 1 => active"
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
        modelName: 'users',
    })

    return users
}