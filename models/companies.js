const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class companies extends Model {
        static associate(models) {
            companies.hasOne(models.user_tokens, {
                foreignKey: "company_user_id",
                onDelete: 'cascade'
            });

            companies.hasMany(models.post_job_vaccancies, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });

            companies.hasOne(models.user_apply_jobs, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });

            companies.hasMany(models.company_images, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });

            companies.hasMany(models.meeting_schedules, {
                foreignKey: "company_id",
                onDelete: 'cascade'
            });

            companies.hasMany(models.connections, {
                foreignKey: 'sender_company_id',
                as: 'senderCompany',
            });

            companies.hasMany(models.connections, {
                foreignKey: 'receiver_company_id',
                as: 'receiverCompany',
            });
        }
    }
    companies.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        company_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        full_name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        type: {
            allowNull: false,
            defaultValue: 'Company',
            type: DataTypes.STRING(255),
        },
        aadhar_front: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        aadhar_back: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        aadhar_card_number: {
            type: DataTypes.STRING(12),
            allowNull: true,
        },
        pan_card: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        pan_card_number: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        company_type: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        company_size: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        location: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        google_map_link: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        working_field: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        short_desc: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        company_sector: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        company_industry: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        founded_in_year: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        country: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        state: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        city: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        number_of_employee: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        revenue_range: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        description: {
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
        modelName: 'companies',
    })

    return companies
}