const express = require('express');

const router = express.Router();
const { userAuth } = require("../middleware/authentication.js")
const { addJob } = require("../controllers/post_job_vaccancies.js");

// add data 
router.route('/add').post(userAuth, addJob);


module.exports = router;