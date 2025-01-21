"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("consultants", "user_name", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'full_name',
    });
    await queryInterface.addColumn("consultants", "language", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'email',
    });
    await queryInterface.addColumn("consultants", "current_reside_country", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'current_location',
    });
    await queryInterface.addColumn("consultants", "age", {
      type: Sequelize.STRING(255),
      allowNull: true,
      after: 'language',
    });
  },
};