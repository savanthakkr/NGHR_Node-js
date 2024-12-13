const express = require('express');

const router = express.Router();
const { userAuth } = require("../middleware/authentication.js")
const { addJob, getJob, getJobById } = require("../controllers/post_job_vaccancies.js");

// add data 
router.route('/add').post(userAuth, addJob);

// get job 
router.route('/get').post(userAuth, getJob);

// get job by title
router.route('/:id').get(userAuth, getJobById);


module.exports = router;