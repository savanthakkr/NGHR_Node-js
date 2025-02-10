const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class consultants extends Model {
        static associate(models) {
            consultants.hasMany(models.consultant_experiences, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.consultant_projects, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.consultant_certificates, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasOne(models.user_tokens, {
                foreignKey: "consultant_user_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.company_saved_consultants, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.consultant_apply_jobs, {
                foreignKey: "consultant_id",
                onDelete: 'cascade'
            });

            consultants.hasMany(models.connections, {
                foreignKey: 'sender_consultant_id',
                as: 'senderConsultant',
            });

            consultants.hasMany(models.connections, {
                foreignKey: 'receiver_consultant_id',
                as: 'receiverConsultant',
            });

            consultants.hasMany(models.messages, {
                foreignKey: 'sender_consultant_id',
                as: 'messageSenderConsultant',
            });

            consultants.hasMany(models.messages, {
                foreignKey: 'receiver_consultant_id',
                as: 'messageReceiverConsultant',
            });
        }
    }
    consultants.init({
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.BIGINT(20).UNSIGNED
        },
        full_name: {
            allowNull: true,
            type: DataTypes.STRING(255),
        },
        email: {
            allowNull: false,
            type: DataTypes.STRING(255),
            set(val) {
                this.setDataValue('email', val.toLowerCase())
            }
        },
        phone_number: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        current_location: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        profile_image: {
            type: DataTypes.STRING(255),
            allowNull: true,
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
        modelName: 'consultants',
    })

    return consultants
}