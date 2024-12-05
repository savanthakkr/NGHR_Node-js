'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('user_documents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "users", key: "id" }
      },
      aadhar_front: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      aadhar_back: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      aadhar_number: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      pancard: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      pancard_number: {
        type: Sequelize.STRING(350),
        allowNull: true
      },
      plan_id: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      plan_exp_date: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      status: {
        allowNull: false,
        type: Sequelize.TINYINT(1),
        defaultValue: 1,
        comment: "0 => not active, 1 => active"
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
    await queryInterface.dropTable('user_documents');
  }
};
