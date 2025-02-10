"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("user_tokens", "socket_id", {
      allowNull: true,
      type: Sequelize.STRING(255),
      after: 'access_token',
    });
  },
};