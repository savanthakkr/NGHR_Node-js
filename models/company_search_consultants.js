const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class company_search_consultants extends Model {
        static associate(models) {
            company_search_consultants.belongsTo(models.companies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });

            company_search_consultants.hasMany(models.consultant_apply_jobs, {
                foreignKey: "job_id",
                onDelete: 'cascade'
            });
        }
    }
    company_search_consultants.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        company_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        consultant_category: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        service: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        serviceDescription: {
            type: DataTypes.STRING(410),
            allowNull: false,
        },
        payment_milestones: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        budget: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        location: {
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
        modelName: 'company_search_consultants',
    })

    return company_search_consultants
}