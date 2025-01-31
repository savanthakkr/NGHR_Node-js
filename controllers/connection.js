
const {
    companies: companiesSchema,
    users: userSchema,
    connections: connectionsSchema
} = require("../models/index.js");
const { Op } = require('sequelize');

// send a connection request
const sendConnectionRequest = async (req, res) => {
    try {
        const { receiverId, receiverType } = req?.body;
        const senderId = req?.userInfo?.id;
        const senderType = req?.userInfo?.type;

        let senderUserId = null, receiverUserId = null, senderCompanyId = null, receiverCompanyId = null;

        if (senderType === 'User') {
            senderUserId = senderId;
        } else if (senderType === 'Company') {
            senderCompanyId = senderId;
        }

        if (receiverType === 'User') {
            receiverUserId = receiverId;
        } else if (receiverType === 'Company') {
            receiverCompanyId = receiverId;
        }

        const existingRequest = await connectionsSchema.findOne({
            where: {
                sender_user_id: senderUserId,
                sender_company_id: senderCompanyId,
                receiver_user_id: receiverUserId,
                receiver_company_id: receiverCompanyId,
            }
        });

        if (existingRequest) {
            if (existingRequest.status === 2) {
                await connectionsSchema.update({ status: 0 }, { where: { id: existingRequest?.id } });
                return res.status(200).json({ message: 'Connection request reactivated.', connection: existingRequest });
            } else {
                return res.status(400).json({ message: 'Connection request already sent.' });
            }
        }

        const from = senderType.toLowerCase();
        const to = receiverType.toLowerCase();

        // Create a new connection request
        const connection = await connectionsSchema.create({
            sender_user_id: senderUserId,
            sender_company_id: senderCompanyId,
            receiver_user_id: receiverUserId,
            receiver_company_id: receiverCompanyId,
            from,
            to,
            status: 0
        });

        res.status(200).json({ message: 'Connection request sent.', connection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// accept a connection request
const acceptConnectionRequest = async (req, res) => {
    try {
        const { id } = req?.params;
        const receiverId = req?.userInfo.id;
        const receiverType = req?.userInfo?.type;

        let receiverUserId = null, receiverCompanyId = null;

        if (receiverType === 'User') {
            receiverUserId = receiverId;
        } else if (receiverType === 'Company') {
            receiverCompanyId = receiverId;
        }

        const connection = await connectionsSchema.findOne({
            where: {
                id: id,
                status: 0,
                [Op.or]: [
                    { receiver_user_id: receiverUserId },
                    { receiver_company_id: receiverCompanyId }
                ]
            },
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection request not found or already accepted/rejected.' });
        }

        await connectionsSchema.update({ status: 1 }, {
            where: { id: id }
        });

        res.status(200).json({ message: 'Connection request accepted.', connection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// get all connections
const getConnections = async (req, res) => {
    try {
        const userInfo = req?.userInfo;
        const userId = req?.userInfo?.id;
        const status = req?.body?.status;
        let whereCondition = {};

        if (status === "followers") {
            whereCondition = {
                [Op.or]: [
                    { receiver_user_id: userId },
                    { receiver_company_id: userId }
                ],
                status: 1,
                to: userInfo?.type === 'User' ? 'user' : 'company'
            };
        } else if (status === "following") {
            whereCondition = {
                [Op.or]: [
                    { sender_user_id: userId },
                    { sender_company_id: userId }
                ],
                status: 1,
                from: userInfo?.type === 'User' ? 'user' : 'company'
            };
        } else if (status === "pending") {
            whereCondition = {
                [Op.or]: [
                    { sender_user_id: userId },
                    { sender_company_id: userId }
                ],
                status: 0,
                from: userInfo?.type === 'User' ? 'user' : 'company'
            };
        } else {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }


        const data = await connectionsSchema.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: whereCondition,
            include: [
                {
                    model: userSchema,
                    as: 'senderUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: userSchema,
                    as: 'receiverUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'senderCompany',
                    attributes: ['id', 'full_name'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'receiverCompany',
                    attributes: ['id', 'full_name'],
                    required: false
                }
            ],
        });

        if (data?.length === 0) {
            return res.status(400).json({ message: 'No records found!' });
        }

        res.status(200).json({ message: "request has been completed successfully!!", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// get connection status by sender and receiver
const getConnectionByStatus = async (req, res) => {
    try {
        const userInfo = req?.userInfo;
        const userId = req?.userInfo?.id;

        const data = await connectionsSchema.findAll({
            attributes: { exclude: ["createdAt", "updatedAt"] },
            where: {
                [Op.or]: [
                    { sender_user_id: userId },
                    { sender_company_id: userId },
                    { receiver_user_id: userId },
                    { receiver_company_id: userId }
                ],
                // from: userInfo?.type === 'User' ? 'user' : 'company'
            },
            include: [
                {
                    model: userSchema,
                    as: 'senderUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: userSchema,
                    as: 'receiverUser',
                    attributes: ['id', 'name', 'profile_image'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'senderCompany',
                    attributes: ['id', 'full_name'],
                    required: false
                },
                {
                    model: companiesSchema,
                    as: 'receiverCompany',
                    attributes: ['id', 'full_name'],
                    required: false
                }
            ],
        });

        if (data?.length === 0) {
            return res.status(400).json({ message: 'No records found!' });
        }

        res.status(200).json({ message: "request has been completed successfully!!", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// cancel connection request or remove connection
const cancelConnectionRequest = async (req, res) => {
    try {
        const { id } = req?.params;
        const userId = req?.userInfo?.id;
        const userType = req?.userInfo?.type;

        let userSenderId = null, userCompanyId = null;

        if (userType === 'User') {
            userSenderId = userId;
        } else if (userType === 'Company') {
            userCompanyId = userId;
        }

        const connection = await connectionsSchema.findOne({
            where: {
                id: id,
                [Op.or]: [
                    { sender_user_id: userSenderId },
                    { sender_company_id: userSenderId },
                    { receiver_user_id: userSenderId },
                    { receiver_company_id: userSenderId }
                ]
            }
        });

        if (!connection) {
            return res.status(404).json({ message: 'Connection not found.' });
        }

        await connectionsSchema.update({ status: 2 }, {
            where: { id: id }
        })

        res.status(200).json({ message: 'Connection canceled or removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// get non accepted request
const getNonAcceptedRequests = async (req, res) => {
    try {
        const userId = req.userInfo?.id;
        const userType = req.userInfo?.type;

        let whereCondition = {
            status: 0,
        };

        if (userType === "User") {
            whereCondition.receiver_user_id = userId;
        } else if (userType === "Company") {
            whereCondition.receiver_company_id = userId;
        } else {
            return res.status(400).json({ success: false, message: "Invalid user type." });
        }

        const data = await connectionsSchema.findAll({
            where: whereCondition,
            include: [
                {
                    model: userSchema,
                    as: "senderUser",
                    attributes: ["id", "name", "profile_image"],
                },
                {
                    model: companiesSchema,
                    as: "senderCompany",
                    attributes: ["id", "full_name"],
                },
            ],
        });

        return res.status(200).json({
            success: true,
            message: "Non-accepted requests retrieved successfully.",
            data: data,
        });
    } catch (error) {
        console.error("Error fetching non-accepted requests:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve non-accepted requests.",
        });
    }
};

module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    getConnections,
    getConnectionByStatus,
    cancelConnectionRequest,
    getNonAcceptedRequests
}