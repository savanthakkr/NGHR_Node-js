const {
    user_tokens: userTokenSchema,
    users: userSchema,
    user_documents: userDocumentSchema
} = require("../models/index")
var jwt = require('jsonwebtoken');
const { saveBase64File } = require("../utils/helper");

// GenerateToken
const generateToken = (user) => {
    return jwt.sign({ email: user.email }, 'crud', { expiresIn: '24h' });
};

// user register
const userRegister = async (req, res) => {
    try {
        const { name, email, mobile, type } = req.body;

        const existingName = await userSchema.findOne({
            where: { name },
        });

        if (existingName) {
            return res.status(400).json({ error: true, message: 'Name already exists!' });
        }

        const existingEmail = await userSchema.findOne({
            where: { email: email },
        });

        if (existingEmail) {
            return res.status(400).json({ error: true, message: 'Email already exists!' });
        }

        if (mobile) {
            const existingMobile = await userSchema.findOne({
                where: { mobile: mobile },
            });

            if (existingMobile) {
                return res.status(400).json({ error: true, message: 'Mobile number already exists!' });
            }
        }

        const newUser = await userSchema.create({
            name,
            email,
            mobile: mobile || null,
            type,
        });

        return res.status(200).json({
            error: false,
            message: 'Registration successful!',
            data: newUser,
        });
    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ error: true, message: 'Registration process failed!' });
    }
};

// sign in
const signIn = async (req, res) => {
    try {
        const { mobile } = req.body;

        const findUser = await userSchema.findOne({ where: { mobile: mobile } });

        if (!findUser) {
            return res.status(400).json({ message: "User is not available in our system" });
        }

        const token = generateToken(findUser?.email);

        await userTokenSchema.destroy({ where: { user_id: findUser.id } });

        await userTokenSchema.create({ access_token: token, user_id: findUser.id });

        const userData = await userSchema.findOne({
            attributes: ['id', 'email', 'status'],
            where: { email: findUser?.email },
            include: {
                attributes: ['access_token', 'user_id'],
                model: userTokenSchema,
            },
        });

        return res.status(200).json({ message: "Login successful!", userData });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// add user document
const addUserDocument = async (req, res) => {
    try {

        const { user_id, aadhar_number, pancard_number } = req.body;
        const { aadhar_front, aadhar_back, pancard } = req.files;

        if (!aadhar_front || !aadhar_back || !pancard) {
            return res.status(400).json({ error: true, message: 'All document fields are required' });
        }

        const existingDocument = await userDocumentSchema.findOne({ where: { user_id: user_id } });
        if (existingDocument) {
            return res.status(400).json({ error: true, message: 'User Document already exists!!!' });
        }

        const afPath = await saveBase64File(aadhar_front, 'uploads');
        const abPath = await saveBase64File(aadhar_back, 'uploads');
        const panPath = await saveBase64File(pancard, 'uploads');

        const newDocument = await userDocumentSchema.create({
            user_id,
            aadhar_front: afPath,
            aadhar_back: abPath,
            aadhar_number,
            pancard: panPath,
            pancard_number,
        });

        res.status(200).json({
            error: false,
            message: 'Documentation added successfully!!!',
            documentId: newDocument,
        });
    } catch (error) {
        console.error("Error during upload-documents:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    userRegister,
    signIn,
    addUserDocument
}