
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_apply_jobs extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_apply_jobs.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            user_apply_jobs.belongsTo(models.post_job_vaccancies, {
                foreignKey: "job_id",
                onDelete: 'cascade'
            });

            user_apply_jobs.belongsTo(models.companies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });
        }
    };

    user_apply_jobs.init({
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
        job_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "post_job_vaccancies", key: "id" }
        },
        company_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        user_contribute: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        status: {
            allowNull: false,
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            comment: "0 => not active, 1 => active 2 => sort list"
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
        modelName: 'user_apply_jobs',
    });
    return user_apply_jobs;
};