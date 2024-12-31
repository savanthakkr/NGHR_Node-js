module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("meeting_schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT(20).UNSIGNED
      },
      user_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "users", key: "id" }
      },
      job_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "post_job_vaccancies", key: "id" }
      },
      company_id: {
        allowNull: true,
        type: Sequelize.BIGINT(20).UNSIGNED,
        references: { model: "companies", key: "id" }
      },
      summary: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      meet_link: {
        allowNull: true,
        type: Sequelize.STRING(255),
      },
      start_Date_time: {
        allowNull: false,
        type: Sequelize.DATE
      },
      end_Date_time: {
        allowNull: false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('meeting_schedules');
  }
};