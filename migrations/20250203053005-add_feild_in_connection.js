"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("connections", "sender_consultant_id", {
      allowNull: true,
      type: Sequelize.BIGINT(20).UNSIGNED,
      references: { model: "consultants", key: "id" },
      after: 'receiver_company_id',
    });
    await queryInterface.addColumn("connections", "receiver_consultant_id", {
      allowNull: true,
      type: Sequelize.BIGINT(20).UNSIGNED,
      references: { model: "consultants", key: "id" },
      after: 'sender_consultant_id',
    });

    await queryInterface.removeColumn("connections", "from");
    await queryInterface.removeColumn("connections", "to");

    await queryInterface.addColumn("connections", "from", {
      allowNull: false,
      type: Sequelize.ENUM('user', 'company', 'consultant'),
      comment: 'Indicates the type of sender (user,company or consultant)',
      after: 'receiver_consultant_id',
    });
    await queryInterface.addColumn("connections", "to", {
      allowNull: false,
      type: Sequelize.ENUM('user', 'company', 'consultant'),
      comment: 'Indicates the type of receiver (user,company or consultant)',
      after: 'from',
    });

  },
};