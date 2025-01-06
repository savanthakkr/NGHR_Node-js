"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("post_job_vaccancies", "status", {
      allowNull: false,
      type: Sequelize.TINYINT(1),
      after: 'job_benefit_options',
      comment: "0 => not active, 1 => active",
      default: 1
    });
    await queryInterface.addColumn("companies", "type", {
      allowNull: false,
      defaultValue: 'Company',
      type: Sequelize.STRING(255),
      after: 'email'
    });
  },
};