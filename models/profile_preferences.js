const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class profile_preferences extends Model {
        static associate(models) {
            profile_preferences.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });
        }
    }

    profile_preferences.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        user_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
        },
        looking_for_job: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        primary_role: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        open_to_roles: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        experienceLevels: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        job_search_status: {
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
        modelName: 'profile_preferences',
    })

    return profile_preferences
}