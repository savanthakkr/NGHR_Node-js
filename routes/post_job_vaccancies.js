const express = require('express');

const router = express.Router();
const { userAuth } = require("../middleware/authentication.js")
const { addJob, getJob, getJobById,
    getUserApplicationList,
    getJobListByCompanyId,
    updateJobStatus,
    userApplyChangeJobStatus
} = require("../controllers/post_job_vaccancies.js");

// add data 
router.route('/add').post(userAuth, addJob);

// get job 
router.route('/get').post(userAuth, getJob);

// get job by title
router.route('/:id').get(userAuth, getJobById);

// get user job application list
router.route('/apply-job/list').post(userAuth, getUserApplicationList);

// get job listing by the company id
router.route('/list').post(userAuth, getJobListByCompanyId);

// update job status by company id
router.route('/status').put(userAuth, updateJobStatus);

// user apply change job status
router.route('/apply-job/status').put(userAuth, userApplyChangeJobStatus);

module.exports = router;