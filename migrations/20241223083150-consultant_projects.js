'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("consultant_projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      consultant_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "consultants", key: "id" }
      },
      company_key_skill: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      project_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      organization: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      start_date: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      end_date: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      testimonials: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      payment_type: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    await queryInterface.dropTable('consultant_projects');
  }
};