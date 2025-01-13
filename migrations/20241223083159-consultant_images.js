'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("consultant_images", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      consultant_experience_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "consultant_experiences", key: "id" }
      },
      consultant_project_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "consultant_projects", key: "id" }
      },
      images: {
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
    await queryInterface.dropTable('consultant_images');
  }
};