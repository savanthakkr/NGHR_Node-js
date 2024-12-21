"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "age", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'type'
    });
    await queryInterface.addColumn("users", "language", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'age'
    });
    await queryInterface.addColumn("users", "location", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'language'
    });
    await queryInterface.addColumn("users", "username", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'location'
    });
    await queryInterface.addColumn("users", "country", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'username'
    });
    await queryInterface.addColumn("users", "bio", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'country'
    });
    await queryInterface.addColumn("users", "profile_image", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'bio'
    });
    await queryInterface.addColumn("user_tokens", "company_user_id", {
      allowNull: true,
      type: Sequelize.BIGINT(20).UNSIGNED,
      references: { model: "companies", key: "id" },
      after: 'user_id'
    });
  },
};