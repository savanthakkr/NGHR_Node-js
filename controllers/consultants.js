const {
    consultants: consultantsSchema,
    consultant_experiences: consultantExperiencesSchema,
    consultant_projects: consultantProjectsSchema,
    consultant_images: consultantImagesSchema,
    consultant_certificates: consultantCertificatesSchema
} = require("../models/index.js");
const { saveBase64File } = require("../utils/helper.js");
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
        const consultant = await consultantsSchema.create({
            full_name: bodyData?.full_name,
            phone_number: bodyData?.phone_number,
            email: bodyData?.email
        });

        // handle consultant experiences
        if (bodyData?.consultant_experiences && bodyData?.consultant_experiences?.length > 0) {
            for (const experience of bodyData?.consultant_experiences) {
                await consultantExperiencesSchema.create({
                    ...experience,
                    consultant_id: consultant?.id
                });
            }
        }

        // handle consultant projects
        if (bodyData?.consultant_projects && bodyData?.consultant_projects?.length > 0) {
            for (const project of bodyData.consultant_projects) {
                const createdProject = await consultantProjectsSchema.create({
                    ...project,
                    consultant_id: consultant?.id
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
        }

        // handle consultant certificates
        if (bodyData?.consultant_certificates && bodyData?.consultant_certificates?.length > 0) {
            for (const certificate of bodyData?.consultant_certificates) {
                const certificatePath = await saveBase64File(certificate?.image, 'uploads');
                await consultantCertificatesSchema.create({
                    consultant_id: consultant?.id,
                    documents: certificatePath,
                    title: certificate?.title
                });
            }
        }

        return res.status(201).json({
            message: "Consultant created successfully."
        });

    } catch (error) {
        console.error("Error in signup:", error);
        return res.status(500).json({ message: "An error occurred while signing up." });
    }
};

module.exports = {
    signup
};
