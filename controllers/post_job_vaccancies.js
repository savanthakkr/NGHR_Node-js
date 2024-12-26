const {
    post_job_vaccancies: postJobSchema,
    companies: companiesSchema,
    user_apply_jobs: userApplyJobsSchema,
    users: userSchema,
} = require("../models/index.js");
const { Op, where } = require('sequelize');
const sequelize = require('sequelize');

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

// get user job application list
const getUserApplicationList = async (req, res) => {
    try {
        const userInfo = req?.userInfo;
        const bodyData = req?.body;

        const currentPage = bodyData?.currentPage || 1;
        const itemsPerPage = bodyData?.itemsPerPage || 5;
        const offset = (currentPage - 1) * itemsPerPage;

        const applyJobList = await userApplyJobsSchema.findAll({
            where: {
                company_id: userInfo?.id
            },
            include: [
                { model: companiesSchema },
                {
                    model: postJobSchema,
                    attributes: ['id', 'basic_job_title', 'createdAt']
                },
                {
                    model: userSchema,
                    attributes: ['id', 'name', 'profile_image']
                }
            ],
            limit: itemsPerPage,
            offset: offset,
        });

        const totalUserJob = await userApplyJobsSchema.count();

        const totalCount = Math.ceil(totalUserJob / itemsPerPage);

        return res.status(200).json({
            error: false,
            message: 'Uer data fetched successfully!',
            data: applyJobList,
            totalCount: totalCount
        });
    } catch (error) {
        console.log('Error while fetching User Data:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to fetch User!'
        });
    }
}

// get job listing by the company id
const getJobListByCompanyId = async (req, res) => {
    try {
        const userInfo = req?.userInfo;
        const bodyData = req?.body;

        const currentPage = bodyData?.currentPage || 1;
        const itemsPerPage = bodyData?.itemsPerPage || 5;
        const offset = (currentPage - 1) * itemsPerPage;

        const applyJobList = await postJobSchema.findAll({
            attributes: [
                'id',
                'basic_job_title',
                'status',
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM user_apply_jobs
                        WHERE user_apply_jobs.job_id = post_job_vaccancies.id
                    )`),
                    'totalApplications'
                ],
                [
                    sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM user_apply_jobs
                        WHERE user_apply_jobs.job_id = post_job_vaccancies.id AND user_apply_jobs.status = 2
                    )`),
                    'shortlistedApplications'
                ]
            ],
            where: {
                company_id: userInfo?.id,
                // status: 1
            },
            include: [
                {
                    model: companiesSchema,
                    attributes: ['id', 'company_name', 'image'],
                }
            ],
            limit: itemsPerPage,
            offset: offset,
        });

        const totalJobs = await postJobSchema.count({
            where: {
                company_id: userInfo?.id,
                // status: 1
            }
        });

        const totalCount = Math.ceil(totalJobs / itemsPerPage);

        return res.status(200).json({
            error: false,
            message: 'Job data fetched successfully!',
            data: applyJobList,
            totalCount: totalCount
        });
    } catch (error) {
        console.log('Error while fetching Job Data:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to fetch Job List!'
        });
    }
};

// update job status by company id
const updateJobStatus = async (req, res) => {
    try {
        const { jobId, newStatus } = req.body;
        const userInfo = req?.userInfo;

        const job = await postJobSchema.findOne({
            where: {
                id: jobId,
                company_id: userInfo?.id,
            },
        });

        if (!job) {
            return res.status(404).json({
                error: true,
                message: 'Job not found for the given company!'
            });
        }

        const updatedJob = await postJobSchema.update({ status: newStatus }, {
            where: {
                company_id: userInfo?.id,
                id: jobId
            }
        });

        return res.status(200).json({
            error: false,
            message: 'Job status updated successfully!',
            data: updatedJob
        });
    } catch (error) {
        console.log('Error while updating job status:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to update job status!'
        });
    }
};

// user apply change job status
const userApplyChangeJobStatus = async (req, res) => {
    try {
        const { applicationId, newStatus, userId } = req.body;
        const userInfo = req?.userInfo;

        // 0 => In Review, 1 => In Process, 2 => Shortlisted, 3 => Rejected
        const validStatuses = [0, 1, 2, 3];
        if (!validStatuses.includes(newStatus)) {
            return res.status(400).json({
                error: true,
                message: 'Invalid status value!',
            });
        }

        const application = await userApplyJobsSchema.findOne({
            where: {
                id: applicationId,
                company_id: userInfo?.id,
                user_id: userId
            },
        });

        if (!application) {
            return res.status(404).json({
                error: true,
                message: 'Application not found!',
            });
        }

        await userApplyJobsSchema.update(
            { status: newStatus },
            { where: { id: applicationId } }
        );

        return res.status(200).json({
            error: false,
            message: 'Application status updated successfully!',
        });
    } catch (error) {
        console.log('Error while updating application status:', error);
        return res.status(500).json({
            error: true,
            message: 'Failed to update application status!',
        });
    }
};

module.exports = {
    addJob,
    getJob,
    getJobById,
    getUserApplicationList,
    getJobListByCompanyId,
    updateJobStatus,
    userApplyChangeJobStatus
}