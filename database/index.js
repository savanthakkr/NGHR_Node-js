const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    "nghr",
    "root",
    "pAssW1@!1!!123",
    {
        host: "localhost",
        dialect: "mysql",
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connected successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

module.exports = testConnection;
