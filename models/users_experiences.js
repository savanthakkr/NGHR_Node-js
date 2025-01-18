const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class users_experiences extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            users_experiences.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });
        }
    };

    users_experiences.init({
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
        employment_type: {
            type: DataTypes.ENUM('1', '2', '3', '4'),
            allowNull: true,
            after: 'employment_type',
            comment: '1 -> experienced, 2 -> fresher, 3 -> intern, 4 -> freelancer'
        },
        experience_type: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        start_month: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        end_year: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        end_month: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        start_year: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        company_name: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        title: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        employment_type: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        country: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        skills: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        overall_rating: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        work_life_balance: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        salary_benefits: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        promotions: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        job_security: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        skill_development: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        work_satisfaction: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        company_culture: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        liked_about_company: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        disliked_about_company: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        work_policy: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        currently_working: {
            type: DataTypes.STRING(100),
            allowNull: true
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
        modelName: 'users_experiences',
    });
    return users_experiences;
};