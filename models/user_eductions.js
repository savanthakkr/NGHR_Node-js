const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_eductions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_eductions.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });
        }
    };

    user_eductions.init({
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
        highest_qualification: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        x_percentage: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        xii_stream: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        xii_percentage: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        degree: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        course_type: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        grading_system: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        university_name: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        start_month: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        start_year: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        pass_month: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        pass_year: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        skills: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        extracurricular_activity: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        working_environment: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        job_guarantee: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        skill_development: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        faculty_feedback: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        placement_support: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        additional_feedback: {
            type: DataTypes.STRING(410),
            allowNull: true
        },
        plan_id: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        plan_exp_date: {
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
        modelName: 'user_eductions',
    });
    return user_eductions;
};