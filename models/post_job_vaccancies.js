const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class post_job_vaccancies extends Model {
        static associate(models) {
            post_job_vaccancies.belongsTo(models.companies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });

            post_job_vaccancies.hasMany(models.user_saved_jobs, {
                foreignKey: "job_id",
                onDelete: 'cascade'
            });

        }
    }

    post_job_vaccancies.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        company_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        basic_job_title: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        company_name: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        location: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        category: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        job_info_title: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        job_type: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        position_desc: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        company_journey: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        employee_expectations: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        employee_contributions: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        team_description: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        interview_process: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        base_salary_range: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        offer_benefits_desc: {
            allowNull: true,
            type: DataTypes.TEXT,
        },
        job_benefit_options: {
            allowNull: true,
            type: DataTypes.STRING(350),
        },
        payment_method: {
            allowNull: true,
            type: DataTypes.STRING(350),
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
        modelName: 'post_job_vaccancies',
    })

    return post_job_vaccancies
}