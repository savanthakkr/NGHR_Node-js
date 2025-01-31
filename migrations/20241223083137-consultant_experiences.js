'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("consultant_experiences", {
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
      category : {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      service : {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      experience: {
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
    await queryInterface.dropTable('consultant_experiences');
  }
};