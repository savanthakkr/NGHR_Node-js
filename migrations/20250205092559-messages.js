'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      sender_user_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "users", key: "id" }
      },
      receiver_user_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "users", key: "id" }
      },
      sender_company_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "companies", key: "id" }
      },
      receiver_company_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "companies", key: "id" }
      },
      sender_consultant_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "consultants", key: "id" },
      },
      receiver_consultant_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "consultants", key: "id" },
      },
      room_id: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      message: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      is_read: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        comment: " 0 => not read 1 => read "
      },
      from: {
        allowNull: false,
        type: Sequelize.ENUM('user', 'company', 'consultant'),
        comment: 'Indicates the type of sender (user, company or counsultant)'
      },
      to: {
        allowNull: false,
        type: Sequelize.ENUM('user', 'company', 'consultant'),
        comment: 'Indicates the type of receiver (user, company or counsultant)'
      },
      status: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        comment: " 0 => Inactive 1 => Active "
      },
      is_delete: {
        type: Sequelize.TINYINT(1),
        allowNull: false,
        defaultValue: 0,
        Comment: " 0 => Not deleted 1 => Deleted "
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('messages');
  }
};