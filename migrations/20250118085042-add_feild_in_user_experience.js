"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users_experiences", "experience_type", {
      type: Sequelize.ENUM('1', '2', '3', '4'),
      allowNull: true,
      after: 'employment_type',
      comment: '1 -> experienced, 2 -> fresher, 3 -> intern, 4 -> freelancer'
    });
  },
};