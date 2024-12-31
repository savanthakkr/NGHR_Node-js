const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class meeting_schedules extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            meeting_schedules.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            meeting_schedules.belongsTo(models.post_job_vaccancies, {
                foreignKey: "job_id",
                onDelete: 'cascade'
            });

            meeting_schedules.belongsTo(models.companies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });
        }
    };

    meeting_schedules.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        user_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
        },
        job_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "post_job_vaccancies", key: "id" }
        },
        company_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        summary: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },
        meet_link: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },
        start_Date_time: {
            allowNull: false,
            type: DataTypes.DATE
        },
        end_Date_time: {
            allowNull: false,
            type: DataTypes.DATE
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
        modelName: 'meeting_schedules',
    });
    return meeting_schedules;
};