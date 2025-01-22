"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.removeColumn("consultants", "age");
      await queryInterface.removeColumn("consultants", "language");
      await queryInterface.removeColumn("consultants", "user_name");
      await queryInterface.removeColumn("consultants", "current_reside_country");
  },

};
