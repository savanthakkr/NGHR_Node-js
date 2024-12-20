"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("companies", "company_sector", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'image'
    });
    await queryInterface.addColumn("companies", "company_industry", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'company_sector'
    });
    await queryInterface.addColumn("companies", "founded_in_year", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'company_industry'
    });
    await queryInterface.addColumn("companies", "country", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'founded_in_year'
    });
    await queryInterface.addColumn("companies", "state", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'country'
    });
    await queryInterface.addColumn("companies", "city", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'state'
    });
    await queryInterface.addColumn("companies", "number_of_employee", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'city'
    });
    await queryInterface.addColumn("companies", "revenue_range", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'number_of_employee'
    });
    await queryInterface.addColumn("companies", "description", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'revenue_range'
    });
  },
};