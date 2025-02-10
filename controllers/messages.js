
const {
    user_tokens: userTokenSchema,
    messages: chatMessageSchema,
    companies: companiesSchema,
    users: userSchema,
    consultants: consultantsSchema
} = require("../models/index.js");
const Sequelize = require('sequelize');
let bcrypt = require('bcrypt');

// add message
const addMessages = async (req, res) => {
    try {
        const bodyData = req?.body;

        let findSocketIdCondition = {};
        let chatIdCondition = {};
        let senderField, receiverField;

        if (bodyData?.from === 'Company') {
            senderField = 'sender_company_id';
            receiverField = bodyData?.to === 'User' ? 'receiver_user_id' : bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_consultant_id';
        } else if (bodyData?.from === 'User') {
            senderField = 'sender_user_id';
            receiverField = bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_user_id';
        } else {
            senderField = 'sender_consultant_id';
            receiverField = bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_consultant_id';
        }

        findSocketIdCondition = {
            [Sequelize.Op.or]: [
                { user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } }
            ],
        };

        chatIdCondition = {
            [Sequelize.Op.or]: [
                { [senderField]: bodyData?.sender_id, [receiverField]: bodyData?.receiver_id },
                { [senderField]: bodyData?.receiver_id, [receiverField]: bodyData?.sender_id }
            ]
        };

        let findSocketId = await userTokenSchema.findAll({
            attributes: ["socket_id", "user_id", "company_user_id", "consultant_user_id"],
            where: findSocketIdCondition
        });

        const findData = await chatMessageSchema.findOne({
            where: chatIdCondition
        });

        if (!findData) {
            let sortedIds = [bodyData?.sender_id, bodyData?.receiver_id].sort();
            let roomId = sortedIds.map(id => String(id).padStart(11, "0")).join("");
            var dataEnc = await bcrypt.hash(roomId, 11);
        }

        await chatMessageSchema.create({
            message: bodyData?.message,
            room_id: dataEnc ?? findData?.room_id,
            [senderField]: bodyData?.sender_id,
            [receiverField]: bodyData?.receiver_id,
            to: bodyData?.to,
            from: bodyData?.from
        });

        let data = [];

        findSocketId.forEach((id) => {
            data.push({
                socketId: id?.socket_id,
                userId: id?.user_id,
                receiver_id: bodyData?.receiver_id,
                message: bodyData?.message
            });
        });

        return res.status(200).json({
            success: true,
            message: "Message send successfully.",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// update message
const updateMessage = async (req, res) => {
    try {
        const bodyData = req?.body;

        let findSocketIdCondition = {};
        let senderField;

        findSocketIdCondition = {
            [Sequelize.Op.or]: [
                { user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } }
            ],
        };

        let findSocketId = await userTokenSchema.findAll({
            attributes: ["socket_id", "user_id", "company_user_id", "consultant_user_id"],
            where: findSocketIdCondition
        });

        if (bodyData?.from === 'Company') {
            senderField = 'sender_company_id';
            receiverField = bodyData?.to === 'User' ? 'receiver_user_id' : bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_consultant_id';
        } else if (bodyData?.from === 'User') {
            senderField = 'sender_user_id';
            receiverField = bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_user_id';
        } else {
            senderField = 'sender_consultant_id';
            receiverField = bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_consultant_id';
        }

        let checkId = await chatMessageSchema.findOne({
            where: { id: bodyData?.id },
        });

        if (!checkId) {
            return res.status(400).json({ message: 'Message is not found!!' });
        }

        if (checkId[senderField] !== bodyData?.sender_id) {
            return res.status(400).json({ message: "You are not authorized to update this message!" });
        }

        await chatMessageSchema.update({ message: bodyData?.message }, {
            where: {
                id: bodyData?.id
            }
        });

        let data = [];

        await findSocketId.map((id) => {
            let chat = {
                socketId: id?.socket_id,
                userId: id?.user_id,
                message: bodyData?.message
            }
            data.push(chat);
        });

        return res.status(200).json({
            success: true,
            message: "Message updated successfully.",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// delete message
const deleteMessage = async (req, res) => {
    try {
        const bodyData = req?.body;

        let senderField;

        findSocketIdCondition = {
            [Sequelize.Op.or]: [
                { user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } }
            ],
        };

        let findSocketId = await userTokenSchema.findAll({
            attributes: ["socket_id", "user_id", "company_user_id", "consultant_user_id"],
            where: findSocketIdCondition
        });


        if (bodyData?.from === 'Company') {
            senderField = 'sender_company_id';
        } else if (bodyData?.from === 'User') {
            senderField = 'sender_user_id';
        } else {
            senderField = 'sender_consultant_id';
        }

        let message = await chatMessageSchema.findOne({
            where: { id: bodyData?.id }
        });

        if (!message) {
            return res.status(404).json({ message: "Message not found!" });
        }

        if (message[senderField] !== bodyData?.sender_id) {
            return res.status(400).json({ message: "You are not authorized to delete this message!" });
        }

        await chatMessageSchema.update({ is_delete: 1 }, {
            where: { id: bodyData?.id }
        });

        let data = [];

        await findSocketId.map((id) => {
            let chat = {
                socketId: id?.socket_id,
                userId: id?.user_id,
                message: bodyData?.message
            }
            data.push(chat);
        });

        return res.status(200).json({
            success: true,
            message: "Message deleted successfully.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// read messages
const readMessage = async (req, res) => {
    try {
        const bodyData = req?.body;

        let findSocketIdCondition = {};
        let senderField;

        findSocketIdCondition = {
            [Sequelize.Op.or]: [
                { user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { company_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.sender_id } },
                { consultant_user_id: { [Sequelize.Op.eq]: bodyData?.receiver_id } }
            ],
        };

        let findSocketId = await userTokenSchema.findAll({
            attributes: ["socket_id", "user_id", "company_user_id", "consultant_user_id"],
            where: findSocketIdCondition
        });

        if (bodyData?.from === 'Company') {
            senderField = 'sender_company_id';
            receiverField = bodyData?.to === 'User' ? 'receiver_user_id' : bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_consultant_id';
        } else if (bodyData?.from === 'User') {
            senderField = 'sender_user_id';
            receiverField = bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_user_id';
        } else {
            senderField = 'sender_consultant_id';
            receiverField = bodyData?.to === 'Company' ? 'receiver_company_id' : 'receiver_consultant_id';
        }

        let findData = await chatMessageSchema.findAll({
            attributes: ['id'],
            where: {
                [senderField]: bodyData?.sender_id,
                [receiverField]: bodyData?.receiver_id,
                is_read: 0
            },
        });

        if (!findData) {
            return res.status(400).json({ message: 'Message is not found!!' });
        }

        const chatMessageIds = await findData.map(data => data?.id);

        await chatMessageSchema.update({ is_read: 1 }, {
            where: {
                id: { [Sequelize.Op.in]: chatMessageIds },
            }
        });

        let data = [];

        await findSocketId.map((id) => {
            let chat = {
                socketId: id?.socket_id,
                userId: id?.user_id,
                message: bodyData?.message
            }
            data.push(chat);
        });

        return res.status(200).json({
            success: true,
            message: "Message updated successfully.",
            data: data,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// get messages by room id
const getMessagesByRoomId = async (req, res) => {
    try {
        const bodyData = req?.body;

        if (!bodyData?.room_id) {
            return res.status(400).json({ message: "Room id is required." });
        }

        const messages = await chatMessageSchema.findAll({
            where: {
                room_id: bodyData?.room_id,
                is_delete: { [Sequelize.Op.ne]: 1 }
            },
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: userSchema,
                    as: 'messageSenderUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: userSchema,
                    as: 'messageReceiverUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'messageSenderCompany',
                    attributes: ['id', 'full_name', 'company_name'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'messageReceiverCompany',
                    attributes: ['id', 'full_name', 'company_name'],
                    required: false
                },
                {
                    model: consultantsSchema,
                    as: 'messageSenderConsultant',
                    attributes: ['id', 'full_name'],
                    required: false
                },
                {
                    model: consultantsSchema,
                    as: 'messageReceiverConsultant',
                    attributes: ['id', 'full_name'],
                    required: false
                },
            ],
            order: [['createdAt', 'ASC']],
            logging: true
        });

        return res.status(200).json({
            success: true,
            message: "Messages fetched successfully.",
            data: messages,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// get all user last message
const getAllUsersLastMessage = async (req, res) => {
    try {
        const { user_id, type } = req.body;

        let senderFields = [];
        let receiverFields = [];

        if (type === 'User') {
            senderFields = ['sender_user_id'];
            receiverFields = ['receiver_user_id', 'receiver_company_id'];
        } else if (type === 'Company') {
            senderFields = ['sender_company_id'];
            receiverFields = ['receiver_user_id', 'receiver_company_id', 'receiver_consultant_id'];
        } else {
            senderFields = ['sender_consultant_id'];
            receiverFields = ['receiver_company_id', 'receiver_consultant_id'];
        }

        let orConditions = [];

        senderFields.forEach(field => {
            orConditions.push({ [field]: user_id });
        });

        receiverFields.forEach(field => {
            orConditions.push({ [field]: user_id });
        });

        const data = await chatMessageSchema.findAll({
            where: {
                [Sequelize.Op.or]: orConditions,
            },
            include: [
                {
                    model: userSchema,
                    as: 'messageSenderUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: userSchema,
                    as: 'messageReceiverUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'messageSenderCompany',
                    attributes: ['id', 'full_name', 'company_name'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'messageReceiverCompany',
                    attributes: ['id', 'full_name', 'company_name'],
                    required: false
                },
                {
                    model: consultantsSchema,
                    as: 'messageSenderConsultant',
                    attributes: ['id', 'full_name'],
                    required: false
                },
                {
                    model: consultantsSchema,
                    as: 'messageReceiverConsultant',
                    attributes: ['id', 'full_name'],
                    required: false
                },
            ],
            order: [['createdAt', 'DESC']],
            group: ['room_id']
        });

        return res.status(200).json({
            success: true,
            message: "Last messages fetched successfully.",
            data: data,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// search user
const searchUser = async (req, res) => {
    try {
        const { search, role } = req?.body;

        if (!search) {
            return res.status(400).json({ message: "Name is required." });
        }
        if (!role) {
            return res.status(400).json({ message: "User role is required." });
        }

        let results = [];

        if (role === "User") {
            let users = await userSchema.findAll({
                where: { name: { [Sequelize.Op.like]: `%${search}%` } },
                attributes: ['id', 'name', 'profile_image', 'type']
            });

            let companies = await companiesSchema.findAll({
                where: { company_name: { [Sequelize.Op.like]: `%${search}%` } },
                attributes: ['id', 'company_name', 'full_name', 'image', 'type']
            });

            results = [...users, ...companies];

        } else if (role === "Company") {
            let users = await userSchema.findAll({
                where: { name: { [Sequelize.Op.like]: `%${search}%` } },
                attributes: ['id', 'name', 'profile_image', 'type']
            });

            let consultants = await consultantsSchema.findAll({
                where: { full_name: { [Sequelize.Op.like]: `%${search}%` } },
                attributes: ['id', 'full_name', 'profile_image']
            });

            let companies = await companiesSchema.findAll({
                where: { company_name: { [Sequelize.Op.like]: `%${search}%` } },
                attributes: ['id', 'company_name', 'full_name', 'image', 'type']
            });

            results = [...users, ...consultants, ...companies];

        } else if (role === "Consultant") {
            let companies = await companiesSchema.findAll({
                where: { company_name: { [Sequelize.Op.like]: `%${search}%` } },
                attributes: ['id', 'company_name', 'full_name', 'image', 'type']
            });

            let consultants = await consultantsSchema.findAll({
                where: { full_name: { [Sequelize.Op.like]: `%${search}%` } },
                attributes: ['id', 'full_name', 'profile_image']
            });

            results = [...companies, ...consultants];
        }

        return res.status(200).json({
            success: true,
            message: "Search results fetched successfully.",
            data: results
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// update socket id
const updateSocketId = async ({ data }) => {
    try {
        const response = await userTokenSchema.update({ "socket_id": data?.socket_id }, {
            where: {
                access_token: data?.access_token
            }
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addMessages,
    updateMessage,
    deleteMessage,
    readMessage,
    getMessagesByRoomId,
    getAllUsersLastMessage,
    searchUser,
    updateSocketId
} 