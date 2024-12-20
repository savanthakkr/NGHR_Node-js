
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_resumes extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_resumes.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });
        }
    };

    user_resumes.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        user_id: {
            allowNull: false,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
        },
        resume: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        status: {
            allowNull: false,
            type: DataTypes.TINYINT(1),
            defaultValue: 1,
            comment: "0 => not active, 1 => active"
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
        },
    }, {
        sequelize,
        modelName: 'user_resumes',
    });
    return user_resumes;
};