
const {
    companies: companiesSchema,
    user_tokens: userTokenSchema,
    post_job_vaccancies: postJobSchema,

} = require("../models/index.js");
const { saveBase64File, generateToken, getDateRange } = require("../utils/helper.js");
const Sequelize = require('sequelize');

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
            company_name: bodyData?.company_name?.value,
            company_type: bodyData?.company_type?.value,
            aadhar_front: afPath,
            aadhar_back: abPath,
            pan_card: panPath,
        };

        // Save data to the database
        const data = await companiesSchema.create(dataToSave);

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

        const profileImage = await saveBase64File(bodyData?.image, 'uploads');
        bodyData.image = profileImage;
        await companiesSchema.update(bodyData, {
            where: {
                id: bodyData?.id,
            }
        });

        const data = await companiesSchema.findOne({
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
                    jobQuery['job_type'] = {
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
                        jobQuery['category'] = {
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

module.exports = {
    signup,
    signIn,
    getCompanyUserByAuthToken,
    updateUserProfile,
    getCompanyList,
    getCompanyById
}