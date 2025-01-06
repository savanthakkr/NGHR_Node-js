
const {
    companies: companiesSchema,
    user_tokens: userTokenSchema,
    post_job_vaccancies: postJobSchema,
    company_images: companyImagesSchema,
    company_follows: companyFollowsSchema,
    users: userSchema
} = require("../models/index.js");
const { saveBase64File, generateToken, getDateRange, generateGoogleMeetLink } = require("../utils/helper.js");
const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const fs = require('fs');

// signup
const signup = async (req, res) => {
    try {
        const bodyData = req?.body;

        const existingEmail = await companiesSchema.findOne({
            where: {
                email: bodyData?.email,
            }
        });

        if (existingEmail) {
            return res.status(400).json({ error: true, message: 'Email already exists!' });
        }

        if (!bodyData?.aadhar_front || !bodyData?.aadhar_back || !bodyData?.pan_card) {
            return res.status(400).json({ error: true, message: 'All document fields are required!' });
        }

        const afPath = await saveBase64File(bodyData?.aadhar_front, 'uploads');
        const abPath = await saveBase64File(bodyData?.aadhar_back, 'uploads');
        const panPath = await saveBase64File(bodyData?.pan_card, 'uploads');

        const dataToSave = {
            ...bodyData,
            type: "Company",
            company_name: bodyData?.company_name?.value,
            company_type: bodyData?.company_type?.value,
            company_sector: bodyData?.company_sector?.value,
            company_industry: bodyData?.company_industry?.value,
            founded_in_year: bodyData?.founded_in_year?.value,
            country: bodyData?.country?.value,
            state: bodyData?.state?.value,
            city: bodyData?.city?.value,
            number_of_employee: bodyData?.number_of_employee?.value,
            revenue_range: bodyData?.revenue_range?.value,
            aadhar_front: afPath,
            aadhar_back: abPath,
            pan_card: panPath,
        };

        const data = await companiesSchema.create(dataToSave);

        if (bodyData?.company_images && bodyData?.company_images?.length > 0) {
            const imagePromises = bodyData?.company_images?.map(async (imageBase64) => {
                const imagePath = await saveBase64File(imageBase64?.image, 'company_images');
                await companyImagesSchema.create({
                    company_id: data?.id,
                    image: imagePath,
                });
            });

            await Promise.all(imagePromises);
        }

        return res.status(200).json({
            error: false,
            message: 'Registration successful!',
            data: data,
        });
    } catch (error) {
        console.error("Error during company signup!!:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// sign in
const signIn = async (req, res) => {
    try {
        const { email } = req.body;

        const findUser = await companiesSchema.findOne({ where: { email: email } });

        if (!findUser) {
            return res.status(400).json({ message: "User is not available in our system" });
        }

        const token = await generateToken(findUser?.id);

        await userTokenSchema.destroy({ where: { company_user_id: findUser?.id } });

        await userTokenSchema.create({ access_token: token, company_user_id: findUser?.id });

        const userData = await companiesSchema.findOne({
            attributes: ['id', 'email'],
            where: { email: findUser?.email },
            include: [
                {
                    model: userTokenSchema,
                    attributes: ['access_token', 'user_id'],
                }
            ],
        });

        return res.status(200).json({ message: "Login successful!", userData });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// get profile 
const getCompanyUserByAuthToken = async (req, res) => {
    try {

        const data = await companiesSchema.findOne({
            where: {
                id: req?.userInfo?.id,
            },
            include: [
                {
                    model: companyImagesSchema,
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
}

// update user profile
const updateUserProfile = async (req, res) => {
    try {
        const bodyData = req?.body;

        const checkUser = await companiesSchema.findOne({
            where: {
                id: req?.userInfo?.id,
            }
        });

        if (!checkUser) {
            res.status(400).json({ error: true, message: 'User not found!!' });
            return;
        }

        if (bodyData?.image && (bodyData?.image?.match(/^data:(.+);base64,(.+)$/))) {
            const profileImage = await saveBase64File(bodyData?.image, 'uploads');
            bodyData.image = profileImage;
        }

        await companiesSchema.update(bodyData, {
            where: {
                id: bodyData?.id,
            }
        });

        // remove image from the folder
        if (bodyData?.remove_images && bodyData?.remove_images?.length > 0) {
            const imagesToRemove = await companyImagesSchema.findAll({
                where: {
                    id: { [Op.in]: bodyData.remove_images },
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

            await companyImagesSchema.destroy({
                where: {
                    id: { [Op.in]: bodyData.remove_images, }
                }
            });
        }

        if (bodyData?.company_images && bodyData?.company_images?.length > 0) {
            const imagePromises = bodyData?.company_images?.map(async (imageBase64) => {
                if (!imageBase64?.image?.match(/^data:(.+);base64,(.+)$/)) {
                    return;
                } else {
                    const imagePath = await saveBase64File(imageBase64?.image, 'uploads');
                    await companyImagesSchema.create({
                        company_id: bodyData?.id,
                        image: imagePath,
                    });
                }

            });

            await Promise.all(imagePromises);
        }

        const data = await companiesSchema.findOne({
            where: {
                id: bodyData?.id,
            },
            include: { model: companyImagesSchema }
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

// get company list
const getCompanyList = async (req, res) => {
    try {
        const userInfo = req?.userInfo;

        if (!userInfo) {
            return res.status(401).json({ error: true, message: 'Unauthorized access!' });
        }

        const bodyData = req?.body;
        const currentPage = bodyData?.currentPage || 1;
        const itemsPerPage = bodyData?.itemsPerPage || 5;
        const offset = (currentPage - 1) * itemsPerPage;

        const filters = {};
        const jobQuery = {};

        if (bodyData?.filters?.length > 0) {
            bodyData?.filters.forEach((filter) => {
                if (filter?.id === 'basic_job_title') {
                    jobQuery['basic_job_title'] = {
                        [Sequelize.Op.like]: `%${filter?.value.trim()}%`,
                    };
                } else if (filter?.id === 'job_type') {
                    jobQuery['category'] = {
                        [Sequelize.Op.like]: `%${filter?.value.trim()}%`,
                    };
                } else if (filter?.id === 'base_salary_range') {
                    jobQuery['base_salary_range'] = {
                        [Sequelize.Op.like]: `%${filter?.value.trim()}%`,
                    };
                } else if (filter?.id === 'job_post_date') {
                    const { startDate, endDate } = getDateRange(filter?.value);
                    jobQuery['createdAt'] = {
                        [Sequelize.Op.gte]: startDate,
                        [Sequelize.Op.lte]: endDate,
                    };
                } else if (filter?.id === 'experience') {
                    jobQuery['experience'] = {
                        [Sequelize.Op.like]: `%${filter?.value.trim()}%`,
                    };
                } else if (filter?.id === 'category') {
                    const categories = bodyData?.filters
                        .filter(f => f?.id === 'category')
                        .map(f => ({
                            [Sequelize.Op.like]: `%${f?.value.trim()}%`
                        }));
                    if (categories.length > 0) {
                        jobQuery['job_type'] = {
                            [Sequelize.Op.or]: categories
                        };
                    }
                } else {
                    filters[filter?.id] = filter?.value;
                }
            });
        }

        const data = await companiesSchema.findAll({
            where: { ...filters },
            include: [
                {
                    model: postJobSchema,
                    where: { ...jobQuery },
                    attributes: ['id', 'basic_job_title', 'location'],
                },
            ],
            limit: itemsPerPage,
            offset: offset,
        });

        const totalCompanies = await companiesSchema.count({
            where: { ...filters },
        });

        const totalCount = Math.ceil(totalCompanies / itemsPerPage);

        if (data?.length === 0) {
            return res.status(404).json({ error: true, message: 'No Record Found!' });
        }

        return res.status(200).json({
            error: false,
            message: 'Company data fetched successfully!',
            data: data,
            pageCount: totalCount
        });
    } catch (error) {
        console.error('Error while fetching companies:', error);
        return res.status(500).json({ error: true, message: 'Failed to get company data!' });
    }
};

// get company by id
const getCompanyById = async (req, res) => {
    try {
        const company_id = req.params.id;

        const company = await companiesSchema.findOne({
            where: {
                id: company_id,
            },
            include: {
                model: postJobSchema,
            },
        });

        if (!company) {
            return res.status(404).json({
                error: true,
                message: 'Company not found!'
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Company data fetched successfully!',
            data: company,
        });
    } catch (error) {
        console.log('Error while fetching company by ID:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to fetch company by ID!'
        });
    }
}

// schedule google meet
const scheduleGoogleMeet = async (req, res) => {
    try {
        const { summary, startDateTime, endDateTime } = req.body;
        const userInfo = req?.userInfo;

        const company = await companiesSchema.findOne({
            where: {
                id: userInfo?.id,
            },
        });

        if (!company) {
            return res.status(404).json({
                error: true,
                message: 'Company not found!'
            });
        }

        const response = await generateGoogleMeetLink({ summary, startDateTime, endDateTime })
        return res.status(200).json({
            error: false,
            message: 'Company data fetched successfully!',
            data: response,
        });
    } catch (error) {
        console.log('Error while fetching company by ID:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to fetch company by ID!'
        });
    }
}

module.exports = {
    signup,
    signIn,
    getCompanyUserByAuthToken,
    updateUserProfile,
    getCompanyList,
    getCompanyById,
    scheduleGoogleMeet
}