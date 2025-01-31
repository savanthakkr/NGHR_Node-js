'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("company_search_consultants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      company_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "companies", key: "id" }
      },
      consultant_category: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      service: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      serviceDescription: {
        type: Sequelize.STRING(410),
        allowNull: false,
      },
      payment_milestones: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      budget: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    await queryInterface.dropTable('company_search_consultants');
  }
};