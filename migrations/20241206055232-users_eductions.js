'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('user_eductions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "users", key: "id" }
      },
      highest_qualification: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      x_percentage: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      xii_stream: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      xii_percentage: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      degree: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      course_type: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      grading_system: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      university_name: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      start_month: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      start_year: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      pass_month: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      pass_year: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      skills: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      extracurricular_activity: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      working_environment: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      job_guarantee: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      skill_development: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      faculty_feedback: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      placement_support: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      additional_feedback: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: 1,
        comment: "0 => not active, 1 => active"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('user_eductions');
  }
};
