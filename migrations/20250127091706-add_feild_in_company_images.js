"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("company_images", "search_consultant_images", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'image',
    });
  },
};