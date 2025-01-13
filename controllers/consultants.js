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
            const certificatePath = await saveBase64File(certificate.documents, 'uploads');
            await consultantCertificatesSchema.create({
                consultant_id: certificate?.consultant_id,
                documents: certificatePath,
                title: certificate?.title
            });
        }

        return res.status(200).json({ message: "Certificates and licenses added successfully." });
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

}

module.exports = {
    signup,
    signin,
    addExperience,
    addProjects,
    getConsultantById,
    addCertificatesAndLicense,
    updateProfileById
};