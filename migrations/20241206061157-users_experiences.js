'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('users_experiences', {
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
      employment_type: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      start_month: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      start_year: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      end_month: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      end_year: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      company_name: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      employment_type: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      country: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      skills: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      overall_rating: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      work_life_balance: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      salary_benefits: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      promotions: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      job_security: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      skill_development: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      work_satisfaction: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      company_culture: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      liked_about_company: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      disliked_about_company: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      work_policy: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      currently_working: {
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
    await queryInterface.dropTable('users_experiences');
  }
};
