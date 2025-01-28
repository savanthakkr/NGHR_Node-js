
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultant_apply_jobs extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            consultant_apply_jobs.belongsTo(models.consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultant_apply_jobs.belongsTo(models.company_search_consultants, {
                foreignKey: "job_id",
                onDelete: 'cascade'
            });

            consultant_apply_jobs.belongsTo(models.companies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });
        }
    };

    consultant_apply_jobs.init({
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
        job_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "company_search_consultants", key: "id" }
        },
        company_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        status: {
            allowNull: false,
            type: DataTypes.TINYINT(1),
            defaultValue: 0,
            comment: "0=> pending 1 => Accepted 2 =>Rejected "
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
        modelName: 'consultant_apply_jobs',
    });
    return consultant_apply_jobs;
};