
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class user_tokens extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            user_tokens.belongsTo(models.users, {
                foreignKey: "user_id",
                onDelete: 'cascade'
            });

            user_tokens.belongsTo(models.companies, {
                foreignKey: "company_user_id",
                onDelete: 'cascade'
            });
        }
    };

    user_tokens.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        access_token: {
            allowNull: false,
            type: DataTypes.STRING(255),
        },
        user_id: {
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "users", key: "id" }
        },
        company_user_id:{
            allowNull: true,
            type: DataTypes.BIGINT(20).UNSIGNED,
            references: { model: "companies", key: "id" }
        },
        // user_type: {
        //     allowNull: false,
        //     type: DataTypes.STRING(255),
        //     comment: "0 => user, 1 => company, 2 => consultant"
        // },
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
        modelName: 'user_tokens',
    });
    return user_tokens;
};