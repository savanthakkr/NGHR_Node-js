const {
    post_job_vaccancies: postJobSchema,
    companies: companiesSchema,

} = require("../models/index.js");
const { Op } = require('sequelize');

// add job
const addJob = async (req, res) => {
    try {
        const companyInfo = req?.userInfo;
        const bodyData = req?.body;

        const existingJob = await postJobSchema.findOne({
            where: {
                basic_job_title: bodyData?.basic_job_title,
                company_id: companyInfo?.id
            },
        });

        if (existingJob) {
            return res.status(400).json({ error: true, message: 'Job title already exists for this company!' });
        }

        const newJob = await postJobSchema.create({ ...bodyData, company_id: companyInfo?.id });

        return res.status(200).json({
            error: false,
            message: 'Job added successfully!',
            data: newJob,
        });
    } catch (error) {
        console.error('Error while adding job:', error);
        return res.status(500).json({ error: true, message: 'Failed to add job!' });
    }
};

// get job list
const getJob = async (req, res) => {
    try {
        const company_id = req?.userInfo?.id;

        const data = await postJobSchema.findAll({
            where: {
                company_id: company_id
            },
            include: {
                model: companiesSchema,
                attributes: ['company_name', 'id', 'image']
            }
        });

        if (data?.length === 0) {
            return res.status(404).json({ error: true, message: 'No jobs found for this company!' });
        }

        return res.status(200).json({
            error: false,
            message: 'Job data fetched successfully!',
            data: data,
        });
    } catch (error) {
        console.error('Error while fetching job:', error);
        return res.status(500).json({ error: true, message: 'Failed to get job!' });
    }
}

// get job by id
const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await postJobSchema.findOne({
            where: {
                id: jobId,
            },
            include: {
                model: companiesSchema,
                attributes: ['company_name', 'id', 'image', 'company_size'],
            },
        });

        const findSimilarJob = await postJobSchema.findAll({
            where: {
                basic_job_title: { [Op.like]: `%${job?.basic_job_title}%` },
                id: { [Op.ne]: jobId }
            },
            include: {
                model: companiesSchema,
                attributes: ['company_name', 'id', 'image', 'company_size'],
            },
        });

        if (!job) {
            return res.status(404).json({
                error: true,
                message: 'Job not found!'
            });
        }

        return res.status(200).json({
            error: false,
            message: 'Job data fetched successfully!',
            data: job,
            similarJob: findSimilarJob
        });
    } catch (error) {
        console.log('Error while fetching job by ID:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to fetch job by ID!'
        });
    }
};

module.exports = {
    addJob,
    getJob,
    getJobById
}