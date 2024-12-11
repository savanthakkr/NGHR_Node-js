const {
    post_job_vaccancies: postJobSchema,
} = require("../models/index.js");

// add job
const addJob = async (req, res) => {
    try {
        const company_id = req?.userInfo?.id;
        const bodyData = req?.body;

        const existingJob = await postJobSchema.findOne({
            where: {
                basic_job_title: bodyData?.basic_job_title,
                company_id: company_id
            },
        });

        if (existingJob) {
            return res.status(400).json({ error: true, message: 'Job title already exists for this company!' });
        }

        const newJob = await postJobSchema.create({ ...bodyData, company_id: company_id });

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


module.exports = {
    addJob
}