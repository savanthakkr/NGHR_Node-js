const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_documents extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_documents.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });
        }
    };

    user_documents.init({
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
        aadhar_front: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        aadhar_back: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        aadhar_number: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        pancard: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        pancard_number: {
            type: DataTypes.STRING(350),
            allowNull: true
        },
        plan_id: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        plan_exp_date: {
            type: DataTypes.STRING(100),
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
        modelName: 'user_documents',
    });
    return user_documents;
};