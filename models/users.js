const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class users extends Model {
        static associate(models) {
            users.hasOne(models.user_tokens, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasOne(models.user_documents, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasOne(models.user_eductions, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasOne(models.users_experiences, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasOne(models.profile_preferences, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasMany(models.user_saved_jobs, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasMany(models.user_resumes, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasOne(models.user_apply_jobs, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            users.hasOne(models.meeting_schedules, {
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
        age: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        language: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        bio: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        profile_image: {
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
        modelName: 'users',
    })

    return users
}