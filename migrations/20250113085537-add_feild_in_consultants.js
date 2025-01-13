"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("consultants", "current_location", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'phone_number',
    });
    await queryInterface.addColumn("consultants", "profile_image", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'phone_number'
    });
  },
};