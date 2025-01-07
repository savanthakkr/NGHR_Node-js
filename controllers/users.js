const {
    user_tokens: userTokenSchema,
    users: userSchema,
    user_documents: userDocumentSchema,
    user_eductions: userEductionsSchema,
    users_experiences: userExperienceSchema,
    profile_preferences: profilePreferencesSchema,
    companies: companiesSchema,
    post_job_vaccancies: postJobSchema,
    user_saved_jobs: userSavedJobsSchema,
    user_resumes: userResumesSchema,
    user_apply_jobs: userApplyJobsSchema,
    connections: connectionsSchema
} = require("../models/index")
const { saveBase64File, generateToken, getDateRange } = require("../utils/helper");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

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
                required: false,
                where: {
                    status: 1,
                },
            },
            {
                model: companiesSchema,
                required: false,
                attributes: { exclude: ["createdAt", "updatedAt", "password"] },
            },
        ],
    });
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
        const { mobile, user_type } = req.body;

        const findUser = await userSchema.findOne({ where: { mobile: mobile, type: user_type } });

        if (!findUser) {
            return res.status(400).json({ message: "User is not available in our system" });
        }

        const token = await generateToken(findUser?.id);

        await userTokenSchema.destroy({ where: { user_id: findUser?.id } });

        await userTokenSchema.create({ access_token: token, user_id: findUser?.id });

        const userData = await userSchema.findOne({
            attributes: ['id', 'email', 'status', 'type'],
            where: { email: findUser?.email },
            include: [
                {
                    model: userTokenSchema,
                    attributes: ['access_token', 'user_id'],
                    where: {
                        user_id: findUser?.id
                    }
                }
            ]
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
        const bodyData = req.body;

        const userInfo = req?.userInfo;

        if (!Array.isArray(bodyData)) {
            return res.status(400).json({ error: true, message: 'Invalid data format. Expected an array of bodyData.' });
        }

        for (const experience of bodyData) {
            await userExperienceSchema.create({
                ...experience,
                user_id: userInfo?.id || experience?.user_id,
            });
        }

        res.status(200).json({ error: false, message: 'Experience added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to add experiences!' });
    }
};

// update user experience
const updateUserExperience = async (req, res) => {
    try {
        const bodyData = req.body[0];
        const userInfo = req.userInfo;

        if (!bodyData) {
            return res.status(400).json({ error: true, message: 'Invalid experience data!' });
        }

        const findOne = await userExperienceSchema.findOne({
            where: {
                id: bodyData?.id
            }
        });

        if (!findOne) {
            return res.status(404).json({ error: true, message: 'Experience not found!' });
        }

        await userExperienceSchema.update(
            { ...bodyData },
            {
                where: {
                    id: bodyData.id,
                    user_id: userInfo.id,
                },
            }
        );

        res.status(200).json({ error: false, message: 'Experience updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Failed to update experience!' });
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

        if (bodyData?.profile_image && bodyData?.profile_image.match(/^data:(.+);base64,(.+)$/)) {
            const profileImage = await saveBase64File(bodyData?.profile_image, 'uploads');
            bodyData.profile_image = profileImage;
        }

        await userSchema.update(bodyData, {
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

        const experiences = await userExperienceSchema.findAll({
            where: { user_id: req?.params?.id, status: 1 }
        });

        if (!experiences || experiences.length === 0) {
            return res.status(404).json({
                message: "No experience data found for the user."
            });
        }

        res.status(200).json({
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

// get user eduction
const getUserEduction = async (req, res) => {
    try {

        const data = await userEductionsSchema.findAll({
            where: { user_id: req?.params?.id, status: 1 }
        });

        if (!data || data?.length === 0) {
            return res.status(404).json({
                message: "No eduction data found for the user."
            });
        }

        res.status(200).json({
            data: data

        });
    } catch (error) {
        console.error("Error fetching user experience:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching experience data."
        });
    }
};

// get user job
const getUserJob = async (req, res) => {
    try {
        const user_id = req?.userInfo?.id;
        const bodyData = req?.body;

        const currentPage = bodyData?.currentPage || 1;
        const itemsPerPage = bodyData?.itemsPerPage || 5;
        const offset = (currentPage - 1) * itemsPerPage;

        const filters = {};

        if (bodyData?.filters?.length > 0) {
            bodyData?.filters.map((filter) => {
                if (filter?.id === 'category') {
                    const categories = bodyData?.filters
                        .filter(f => f?.id === 'category')
                        .map(f => ({
                            [Sequelize.Op.like]: `%${f?.value.trim()}%`
                        }));
                    if (categories.length > 0) {
                        filters['job_type'] = {
                            [Sequelize.Op.or]: categories
                        };
                    }
                } else if (filter?.id === 'job_post_date') {
                    const { startDate, endDate } = getDateRange(filter?.value);
                    filters['createdAt'] = {
                        [Sequelize.Op.gte]: startDate,
                        [Sequelize.Op.lte]: endDate,
                    };
                } else {
                    filters[filter?.id] = filter?.value;

                }
            });
        }

        const data = await postJobSchema.findAll({
            where: { ...filters },
            include: [
                {
                    model: companiesSchema,
                    attributes: ['company_name', 'id', 'image'],
                }
            ],
            limit: itemsPerPage,
            offset: offset,
        });


        const totalJobs = await postJobSchema.count({
            where: { ...filters },
        });

        const totalCount = Math.ceil(totalJobs / itemsPerPage);

        if (data?.length === 0) {
            return res.status(404).json({ error: true, message: 'No jobs found for this company!' });
        }

        return res.status(200).json({
            error: false,
            message: 'Job data fetched successfully!',
            data: data,
            count: totalCount
        });
    } catch (error) {
        console.error('Error while fetching job:', error);
        return res.status(500).json({ error: true, message: 'Failed to get job!' });
    }
};

// user saved job
const userSavedJob = async (req, res) => {
    try {
        const userInfo = req?.userInfo;
        const { job_id } = req?.body;

        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User not available in our system." });
        }

        const existingEntry = await userSavedJobsSchema.findOne({
            where: { job_id: job_id, user_id: userInfo?.id }
        });

        if (existingEntry) {
            await userSavedJobsSchema.destroy({ where: { job_id: job_id, user_id: userInfo?.id } });
            return res.status(200).json({
                error: false,
                message: "Job unsaved successfully!",
            });
        }

        const newSavedJob = await userSavedJobsSchema.create({
            job_id: job_id,
            user_id: userInfo?.id
        });

        return res.status(200).json({
            error: false,
            message: "Job saved successfully!",
            data: newSavedJob
        });
    } catch (error) {
        console.error('Error while job save status:', error);
        return res.status(500).json({ error: true, message: 'Failed to job save status!' });
    }
};

// get user saved job
const getUserSavedJob = async (req, res) => {
    try {
        const userInfo = req?.userInfo;

        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User is not available in our system." });
        }

        const savedJobs = await userSavedJobsSchema.findAll({
            where: { user_id: userInfo?.id },
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    model: postJobSchema,
                    attributes: { exclude: ["updatedAt"] },
                    include: [
                        {
                            model: companiesSchema,
                            attributes: { exclude: ["createdAt", "updatedAt", "aadhar_front", "aadhar_back", "aadhar_card_number", "pan_card", "pan_card_number"] },
                        },
                    ],
                },
            ],
        });

        return res.status(200).json({
            error: false,
            message: "User saved jobs fetched successfully!",
            data: savedJobs,
        });
    } catch (error) {
        console.error('Error while fetching user saved jobs:', error);
        return res.status(500).json({ error: true, message: 'Failed to fetch user saved jobs!' });
    }
};

// add user resume
const addUserResume = async (req, res) => {
    try {
        const userInfo = req.userInfo;
        const bodyData = req?.body;

        if (!bodyData?.resume) {
            return res.status(400).json({ error: true, message: 'Resume is required.' });
        }

        const resumePath = await saveBase64File(bodyData?.resume, 'uploads');

        const newResume = await userResumesSchema.create({
            user_id: userInfo?.id,
            resume: resumePath,
        });

        return res.status(200).json({
            error: false,
            message: 'Resume added successfully!',
            data: newResume,
        });
    } catch (error) {
        console.error('Error while adding user resume:', error);
        return res.status(500).json({ error: true, message: 'Internal server error.' });
    }
};

// get user resume
const getUserResume = async (req, res) => {
    try {
        const userInfo = req?.userInfo;

        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User is not available in our system." });
        }

        const resumes = await userResumesSchema.findAll({
            where: { user_id: req?.params?.id },
            attributes: { exclude: ["updatedAt"] },
            order: [['createdAt', 'DESC']]
        });

        if (!resumes || resumes.length === 0) {
            return res.status(404).json({ error: true, message: "No resumes found for the user." });
        }

        return res.status(200).json({
            error: false,
            message: "User resumes fetched successfully!",
            data: resumes,
        });
    } catch (error) {
        console.error('Error while fetching user resumes:', error);
        return res.status(500).json({ error: true, message: 'Internal server error.' });
    }
};

// apply job
const applyJob = async (req, res) => {
    try {
        const userInfo = req?.userInfo;
        const bodyData = req?.body;

        if (!userInfo) {
            return res.status(400).json({ error: true, message: "User is not available in our system." });
        }

        if (!bodyData?.job_id || !bodyData?.resume_id) {
            return res.status(400).json({ error: true, message: "Job ID and Resume ID are required." });
        }

        const existingApplication = await userApplyJobsSchema.findOne({
            where: { user_id: userInfo?.id, job_id: bodyData?.job_id },
        });

        if (existingApplication) {
            return res.status(400).json({
                error: true,
                message: "You have already applied for this job.",
            });
        }

        const newApplication = await userApplyJobsSchema.create({ ...bodyData, user_id: userInfo?.id });

        return res.status(200).json({
            error: false,
            message: "Job application submitted successfully!",
            data: newApplication,
        });

    } catch (error) {
        console.error('Error while apply job:', error);
        return res.status(500).json({ error: true, message: 'Internal server error.' });
    }
}

// get user list by job id
const getUserListByJobId = async (req, res) => {
    try {
        const userInfo = req?.userInfo;
        const bodyData = req?.body;

        const currentPage = bodyData?.currentPage || 1;
        const itemsPerPage = bodyData?.itemsPerPage || 5;
        const offset = (currentPage - 1) * itemsPerPage;

        const UserList = await userApplyJobsSchema.findAll({
            where: {
                job_id: bodyData?.jobId,
                company_id: userInfo?.id,
            },
            include: [
                {
                    model: userSchema,
                    attributes: ['id', 'name']
                },
                {
                    model: postJobSchema,
                    attributes: ['id', 'basic_job_title', 'createdAt']
                }
            ],
            limit: itemsPerPage,
            offset: offset,
        });

        const totalJobs = await userApplyJobsSchema.count({
            where: {
                company_id: userInfo?.id,
                job_id: bodyData?.jobId,
            },
        });

        const totalCount = Math.ceil(totalJobs / itemsPerPage);

        return res.status(200).json({
            error: false,
            message: 'Job data fetched successfully!',
            data: UserList,
            totalCount: totalCount
        });
    } catch (error) {
        console.log('Error while fetching User Data:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to fetch User List!'
        });
    }
}

// get user data by id
const getUserById = async (req, res) => {
    try {

        const data = await userSchema.findOne({
            where: {
                id: req?.params?.id
            },
            include: [
                {
                    model: userApplyJobsSchema,
                    include: {
                        model: postJobSchema
                    }
                },
            ]
        });

        if (!data) {
            return res.status(400).json({ error: true, message: "User is not available in our system." });
        }
        return res.status(200).json({
            error: false,
            message: 'User data fetched successfully!',
            data: data
        });
    } catch (error) {
        console.log('Error while fetching User Data:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to fetch User data!'
        });
    }
}

// user sign out
const signOut = async (req, res) => {
    try {
        const { userType } = req.body;
        const userInfo = req?.userInfo;

        if (!userType) {
            return res.status(400).json({ message: 'Invalid request parameters.' });
        }

        if (userType === 'Company') {
            const findOne = await companiesSchema.findOne({
                where: {
                    id: userInfo?.id
                }
            });

            if (!findOne) {
                return res.status(401).json({ message: 'User is not available in our system.' });
            }

            await userTokenSchema.destroy({
                where: {
                    company_user_id: userInfo?.id
                },
            });

            return res.status(200).json({ message: 'User log out successfully.' });
        } else if (userType === 'User') {
            const findOne = await userSchema.findOne({
                where: {
                    id: userInfo?.id
                }
            });

            if (!findOne) {
                return res.status(401).json({ message: 'User is not available in our system.' });
            }

            await userTokenSchema.destroy({
                where: {
                    user_id: userInfo?.id
                },
            });

            return res.status(200).json({ message: 'User log out successfully.' });
        }
    } catch (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ message: 'Error during log out.' });
    }
}

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
    getUserExperience,
    getUserJob,
    userSavedJob,
    getUserSavedJob,
    addUserResume,
    getUserResume,
    applyJob,
    getUserListByJobId,
    getUserById,
    signOut,
    updateUserExperience,
    getUserEduction
}