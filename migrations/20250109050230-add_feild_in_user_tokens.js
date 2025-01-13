"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_tokens", "consultant_user_id", {
      allowNull: true,
      type: Sequelize.BIGINT(20).UNSIGNED,
      references: { model: "consultants", key: "id" },
      after: 'company_user_id',
    });
  },
};