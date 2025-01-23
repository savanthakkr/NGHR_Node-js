const {
    consultants: consultantsSchema,
    consultant_experiences: consultantExperiencesSchema,
    consultant_projects: consultantProjectsSchema,
    consultant_images: consultantImagesSchema,
    consultant_certificates: consultantCertificatesSchema,
    user_tokens: userTokenSchema,
} = require("../models/index.js");
const { saveBase64File, generateToken } = require("../utils/helper.js");
const { Op } = require('sequelize');
const Sequelize = require('sequelize');

// sign up
const signup = async (req, res) => {
    try {
        const bodyData = req?.body;

        if (!bodyData?.full_name || !bodyData?.phone_number || !bodyData?.email) {
            return res.status(400).json({ message: "All fields are required: full name, phone number, email." });
        }

        const existingConsultant = await consultantsSchema.findOne({
            where: {
                [Op.or]: [
                    { email: bodyData?.email },
                    { phone_number: bodyData?.phone_number }
                ]
            }
        });

        if (existingConsultant) {
            return res.status(400).json({ message: "Email or phone number already exists." });
        }

        // create consultant
        const data = await consultantsSchema.create({
            full_name: bodyData?.full_name,
            phone_number: bodyData?.phone_number,
            email: bodyData?.email
        });

        return res.status(200).json({ message: "Consultant created successfully.", data });

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "An error occurred while signing up." });
    }
};

// sign in
const signin = async (req, res) => {
    try {
        const { phoneNumber } = req?.body;

        if (!phoneNumber) {
            return res.status(400).json({ message: "Phone number is required." });
        }

        const consultant = await consultantsSchema.findOne({
            where: { phone_number: phoneNumber }
        });

        if (!consultant) {
            return res.status(400).json({ message: "Consultant not found." });
        }

        const token = generateToken(consultant);

        await userTokenSchema.destroy({
            where: { consultant_user_id: consultant?.id },
        });

        await userTokenSchema.create({
            access_token: token,
            consultant_user_id: consultant?.id
        });

        const consultantData = await consultantsSchema.findOne({
            attributes: ['id', 'full_name', 'email', 'phone_number'],
            where: { id: consultant.id },
            include: [
                {
                    model: userTokenSchema,
                    attributes: ['access_token'],
                }
            ],
        });

        return res.status(200).json({
            message: "Signin successful.",
            data: consultantData
        });
    } catch (error) {
        console.error("Error during signin:", error);
        return res.status(500).json({ message: "An error occurred while signing in." });
    }
};

// add experience
const addExperience = async (req, res) => {
    try {
        const bodyData = req?.body;

        const experience = await consultantExperiencesSchema.create({
            ...bodyData,
            experience: `${bodyData?.experienceFrom} - ${bodyData?.experienceTo}`,
            consultant_id: bodyData?.consultant_id,
        });

        const imagePromises = bodyData?.experience_images?.map(async (base64Image) => {
            const imagePath = await saveBase64File(base64Image?.image, 'uploads');
            return consultantImagesSchema.create({
                consultant_experience_id: experience?.id,
                images: imagePath,
            });
        });

        await Promise.all(imagePromises);

        return res.status(200).json({ message: "Experience added successfully." });

    } catch (error) {
        console.error("Error in addExperience:", error);
        return res.status(500).json({
            message: "An error occurred while adding experience."
        });
    }
};

// add projects
const addProjects = async (req, res) => {
    try {
        const bodyData = req?.body;

        for (const project of bodyData) {
            const createdProject = await consultantProjectsSchema.create({
                ...project,
                consultant_id: project?.consultant_id
            });

            if (project?.images) {
                for (const image of project?.images) {
                    const projectImagePath = await saveBase64File(image?.image, 'uploads');
                    await consultantImagesSchema.create({
                        consultant_project_id: createdProject?.id,
                        images: projectImagePath
                    });
                }
            }
        }

        return res.status(200).json({ message: "Projects added successfully." });
    } catch (error) {
        console.error("Error in addProjects:", error);
        return res.status(500).json({
            message: "An error occurred while adding projects."
        });
    }
};

// add certificates and license
const addCertificatesAndLicense = async (req, res) => {
    try {
        const bodyData = req?.body;

        for (const certificate of bodyData) {
            const certificatePath = await saveBase64File(certificate?.documents, 'uploads');
            await consultantCertificatesSchema.create({
                consultant_id: certificate?.consultant_id,
                documents: certificatePath,
                title: certificate?.title
            });
        }

        const data = await consultantCertificatesSchema.findAll({
            where: {
                consultant_id: bodyData[0]?.consultant_id
            }
        });

        return res.status(200).json({ message: "Certificates and licenses added successfully.", data: data });
    } catch (error) {
        console.error("Error in addCertificatesAndLicense:", error);
        return res.status(500).json({
            message: "An error occurred while adding certificates and licenses."
        });
    }
};

// get consultant by id
const getConsultantById = async (req, res) => {
    try {
        const { id } = req?.params;

        if (!id) {
            return res.status(400).json({ message: "Consultant ID is required." });
        }

        const consultant = await consultantsSchema.findOne({
            where: { id: id },
            include: [
                {
                    model: consultantExperiencesSchema,
                    include: [
                        {
                            model: consultantImagesSchema,
                            attributes: ["id", "images"]
                        }
                    ]
                },
                {
                    model: consultantProjectsSchema,
                    include: [
                        {
                            model: consultantImagesSchema,
                            attributes: ["id", "images"]
                        }
                    ]
                },
                {
                    model: consultantCertificatesSchema,
                    attributes: ["id", "title", "documents"]
                }
            ]
        });

        if (!consultant) {
            return res.status(404).json({ message: "Consultant not found." });
        }

        return res.status(200).json({ message: "Consultant retrieved successfully.", consultant });
    } catch (error) {
        console.error("Error in getConsultantById:", error);
        return res.status(500).json({ message: "An error occurred while fetching consultant details." });
    }
};

// update profile by id
const updateProfileById = async (req, res) => {
    try {
        const bodyData = req?.body;

        const checkUser = await consultantsSchema.findOne({
            where: {
                id: req?.userInfo?.id,
            }
        });

        if (!checkUser) {
            res.status(400).json({ error: true, message: 'User not found!!' });
            return;
        }

        if (bodyData?.profile_image && (bodyData?.profile_image?.match(/^data:(.+);base64,(.+)$/))) {
            const profileImage = await saveBase64File(bodyData?.profile_image, 'uploads');
            bodyData.profile_image = profileImage;
        }

        await consultantsSchema.update(bodyData, {
            where: {
                id: bodyData?.id,
            }
        });

        const data = await consultantsSchema.findOne({
            where: {
                id: bodyData?.id,
            },
        });

        res.status(200).json({
            error: false,
            message: 'User updated successfully!!!',
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error!!' });
        return;
    }
}

// get consultant list
const getConsultantList = async (req, res) => {
    try {
        const bodyData = req?.body;
        const currentPage = bodyData?.currentPage || 1;
        const itemsPerPage = bodyData?.itemsPerPage || 5;
        const offset = (currentPage - 1) * itemsPerPage;

        const experienceLevels = {
            "entry level": [1, 2],
            "mid level": [3, 5],
            "senior level": [6, Infinity],
        };

        const filters = {};

        if (bodyData?.filters?.length > 0) {
            bodyData.filters.forEach((filter) => {
                if (!filter?.id?.trim() || !filter?.value?.trim()) return;

                if (filter?.id === "experience") {
                    const range = experienceLevels[filter?.value.toLowerCase()];
                    if (range) {
                        filters["experience"] = { [Sequelize.Op.between]: range };
                    }
                } else {
                    filters[filter?.id] = { [Sequelize.Op.like]: `%${filter?.value.trim()}%` };
                }
            });
        }

        const data = await consultantExperiencesSchema.findAll({
            where: { ...filters },
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
                {
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    model: consultantsSchema,
                },
            ],
            limit: itemsPerPage,
            offset: offset,
        });

        const totalConsultant = await consultantExperiencesSchema.count({
            where: { ...filters },
        });

        const totalCount = Math.ceil(totalConsultant / itemsPerPage);

        if (!data?.length) {
            return res.status(404).json({ error: true, message: "No Record Found!" });
        }

        return res.status(200).json({
            error: false,
            message: "Consultant data fetched successfully!",
            data,
            pageCount: totalCount,
        });
    } catch (error) {
        console.error("Error while fetching consultant:", error);
        return res.status(500).json({ error: true, message: "Failed to get consultant data!" });
    }
};

// update profile preference || experience
const updateProfilePreferenceById = async (req, res) => {
    try {
        const bodyData = req?.body;

        const checkUser = await consultantsSchema.findOne({
            where: {
                id: req?.userInfo?.id || bodyData?.id,
            }
        });

        if (!checkUser) {
            res.status(400).json({ error: true, message: 'User not found!!' });
            return;
        }

        await consultantExperiencesSchema.update(bodyData, {
            where: {
                id: bodyData?.id,
                consultant_id: bodyData?.consultant_id
            }
        })
        // remove image from the folder
        if (bodyData?.remove_images && bodyData?.remove_images?.length > 0) {
            const imagesToRemove = await consultantImagesSchema.findAll({
                where: {
                    id: { [Op.in]: bodyData?.remove_images },
                }
            });

            imagesToRemove?.map((image) => {
                const fileName = image?.image?.split('/').pop();
                const filePath = `uploads/${fileName}`;
                try {
                    fs.unlinkSync(filePath);
                } catch (error) {
                    console.error(`Failed to delete file: ${filePath}`, error);
                }
            });

            await consultantImagesSchema.destroy({
                where: {
                    id: { [Op.in]: bodyData?.remove_images, }
                }
            });
        }

        if (bodyData?.consultant_images && bodyData?.consultant_images?.length > 0) {
            const imagePromises = bodyData?.consultant_images?.map(async (imageBase64) => {
                if (!imageBase64?.images?.match(/^data:(.+);base64,(.+)$/)) {
                    return;
                } else {
                    const imagePath = await saveBase64File(imageBase64?.images, 'uploads');
                    await consultantImagesSchema.create({
                        consultant_experience_id: bodyData?.id,
                        images: imagePath,
                    });
                }
            });
            await Promise.all(imagePromises);
        }

        const data = await consultantExperiencesSchema.findOne({
            where: {
                id: bodyData?.id,
            },
            include: { model: consultantImagesSchema }
        });

        res.status(200).json({
            error: false,
            message: 'User updated successfully!!!',
            data: data,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: true, message: 'Internal server error!!' });
        return;
    }
}

// update profile project
const updateProfileProjectsById = async (req, res) => {
    try {
        const bodyData = req?.body;
        console.log('bodyData: ', bodyData);

        for (const project of bodyData) {
            let existingProject = await consultantProjectsSchema.findOne({
                where: {
                    consultant_id: project?.consultant_id,
                    id: project?.id,
                },
            });

            if (existingProject) {
                await existingProject.update({
                    ...project
                }, {
                    where: {
                        consultant_id: project?.consultant_id
                    }
                });

            } else {
                await consultantProjectsSchema.create({
                    ...project,
                    consultant_id: project?.consultant_id,
                });
            }
        }

        return res.status(200).json({ message: "Projects updated successfully." });
    } catch (error) {
        console.error("Error in updateProfileProjectsById:", error);
        return res.status(500).json({
            message: "An error occurred while updating projects.",
        });
    }
};

// get user ny id
const getUserByAuthToken = async (req, res) => {
    try {
        const data = await consultantsSchema.findOne({
            where: { id: req?.userInfo?.id },
            include: [
                {
                    model: consultantExperiencesSchema,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                    include: [
                        {
                            model: consultantImagesSchema,
                            attributes: ["id", "images"]
                        }
                    ]
                },
                {
                    model: consultantProjectsSchema,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                },
                {
                    model: consultantCertificatesSchema,
                    attributes: { exclude: ["createdAt", "updatedAt"] },
                }
            ]
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


module.exports = {
    signup,
    signin,
    addExperience,
    addProjects,
    getConsultantById,
    addCertificatesAndLicense,
    updateProfileById,
    getConsultantList,
    updateProfilePreferenceById,
    updateProfileProjectsById,
    getUserByAuthToken
};