'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("companies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
      },
      company_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      aadhar_front: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      aadhar_back: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      aadhar_card_number: {
        type: Sequelize.STRING(12),
        allowNull: true,
      },
      pan_card: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      pan_card_number: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      company_type: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      google_map_link: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      working_field: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      short_desc: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
    await queryInterface.dropTable('companies');
  }
};
