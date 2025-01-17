'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('post_job_vaccancies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
      },
      company_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "companies", key: "id" }
      },
      basic_job_title: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      company_name: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      location: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      category: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      job_info_title: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      job_type: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      position_desc: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      company_journey: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      employee_expectations: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      employee_contributions: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      team_description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      interview_process: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      base_salary_range: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      payment_method: {
        allowNull: true,
        type: Sequelize.STRING(350),
      },
      offer_benefits_desc: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      job_benefit_options: {
        allowNull: true,
        type: Sequelize.STRING(350),
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
    await queryInterface.dropTable('post_job_vaccancies');
  }
};
