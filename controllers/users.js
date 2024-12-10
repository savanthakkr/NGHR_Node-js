const {
    user_tokens: userTokenSchema,
    users: userSchema,
    user_documents: userDocumentSchema,
    user_eductions: userEductionsSchema,
    users_experiences: userExperienceSchema,
    profile_preferences: profilePreferencesSchema
} = require("../models/index")
var jwt = require('jsonwebtoken');
const { saveBase64File } = require("../utils/helper");

// Get user token info
const getUserTokenInfo = async (access_token) => {
    return await userTokenSchema.findOne({
        where: {
            access_token,
        },
        attributes: ["user_id", "createdAt", "updatedAt"],
        include: [
            {
                model: userSchema,
                attributes: { exclude: ["createdAt", "updatedAt", "password"] },
                where: {
                    status: 1,
                },
            },
        ],
    });
};

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

        const token = generateToken(findUser?.id);

        await userTokenSchema.destroy({ where: { user_id: findUser?.id } });

        await userTokenSchema.create({ access_token: token, user_id: findUser?.id });

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

        const { user_id, aadhar_number, pancard_number, aadhar_front, aadhar_back, pancard } = req?.body;

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

// add user eduction
const addUserEducation = async (req, res) => {
    try {
        const bodyData = req?.body;
        console.log('bodyData: ', bodyData);

        const existingEducation = await userEductionsSchema.findOne({
            where: { user_id: bodyData?.user_id }
        });

        if (existingEducation) {
            return res.status(400).json({ error: true, message: 'User education already exists!' });
        }

        await userEductionsSchema.create(bodyData);

        res.status(200).json({ error: false, message: 'Education added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to add education!' });
    }
};

// add user experience
const addUserExperience = async (req, res) => {
    try {
        const bodyData = req?.body;

        const existingExperience = await userExperienceSchema.findOne({
            where: { user_id: bodyData?.user_id }
        });

        if (existingExperience) {
            return res.status(400).json({ error: true, message: 'User experience already exists!' });
        }

        await userExperienceSchema.create(bodyData);

        res.status(200).json({ error: false, message: 'Experience added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to add experience!' });
    }
};

// get user by id
const getUserByAuthToken = async (req, res) => {
    try {
        const data = await userSchema.findOne({
            where: {
                id: req?.userInfo?.id,
            }
        });

        if (!data) {
            res.status(400).json({ error: true, message: 'User not found!!' });
            return;
        };

        res
            .status(200)
            .json({ error: false, message: "Request has been completed successfully!!", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to get data!' });
        return;
    }
};

// update user
const updateUser = async (req, res) => {
    try {
        const bodyData = req?.body;

        const checkUser = await userSchema.findOne({
            where: {
                id: req?.userInfo?.id,
            }
        });

        if (!checkUser) {
            res.status(400).json({ error: true, message: 'User not found!!' });
            return;
        }

        const profileImage = await saveBase64File(bodyData?.profile_image, 'uploads');
        bodyData.profile_image = profileImage;
        const ok = await userSchema.update(bodyData, {
            where: {
                id: bodyData?.id,
            }
        });

        const data = await userSchema.findOne({
            where: {
                id: bodyData?.id,
            }
        });

        res.status(200).json({
            error: false,
            message: 'User updated successfully!!!',
            documentId: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error!!' });
        return;
    }
}

// update user preferences
const updateUserPreferences = async (req, res) => {
    try {
        const bodyData = req?.body;
        console.log('bodyData: ', bodyData);

        const checkUser = await userSchema.findOne({
            where: {
                id: req?.userInfo?.id,
            }
        });

        if (!checkUser) {
            res.status(400).json({ error: true, message: 'User not found!!' });
            return;
        }

        let userPreferences = await profilePreferencesSchema.findOne({
            where: {
                user_id: req?.userInfo?.id,
            }
        });

        if (bodyData?.experienceLevels) {
            bodyData.experienceLevels = Object.keys(bodyData.experienceLevels)
                .filter(level => bodyData.experienceLevels[level])
                .join(', ');
        }

        // If the user already has preferences, update them
        if (userPreferences) {
            await profilePreferencesSchema.update(bodyData, {
                where: {
                    user_id: req?.userInfo?.id,
                }
            });
        } else {
            bodyData.user_id = req?.userInfo?.id;
            await profilePreferencesSchema.create(bodyData);
        }

        const data = await profilePreferencesSchema.findOne({
            where: {
                user_id: req?.userInfo?.id,
            }
        });

        res.status(200).json({
            error: false,
            message: 'User preferences updated successfully!!!',
            documentId: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error!!' });
        return;
    }
};

// get user preferences
const getUserPreferences = async (req, res) => {
    try {
        const data = await profilePreferencesSchema.findOne({
            where: {
                user_id: req?.userInfo?.id,
            }
        });

        if (!data) {
            res.status(400).json({ error: true, message: 'User Preference data is not found!!' });
            return;
        };

        res
            .status(200)
            .json({ error: false, message: "Request has been completed successfully!!", data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to get data!' });
        return;
    }
}

// get user experience
const getUserExperience = async (req, res) => {
    try {
        const userId = req.userInfo.id;

        const experiences = await userExperienceSchema.findAll({
            where: { user_id : userId }
        });

        if (!experiences || experiences.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No experience data found for the user."
            });
        }

        res.status(200).json({
            status: "success",
            data: {
                experiences
            }
        });
    } catch (error) {
        console.error("Error fetching user experience:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching experience data."
        });
    }
};

module.exports = {
    userRegister,
    signIn,
    addUserDocument,
    addUserEducation,
    addUserExperience,
    getUserByAuthToken,
    getUserTokenInfo,
    updateUser,
    updateUserPreferences,
    getUserPreferences,
    getUserExperience
}