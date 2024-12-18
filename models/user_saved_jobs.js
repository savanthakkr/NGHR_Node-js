
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_saved_jobs extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_saved_jobs.belongsTo(models.post_job_vaccancies, {
                foreignKey: "job_id",
                onDelete: 'cascade'
            });

            user_saved_jobs.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });
        }
    };

    user_saved_jobs.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        job_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "post_job_vaccancies", key: "id" }
        },
        user_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
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
        modelName: 'user_saved_jobs',
    });
    return user_saved_jobs;
};