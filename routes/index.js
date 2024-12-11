const express = require('express');
const router = express.Router();

// Import routes
const userRouter = require("./user.js");
const companyRouter = require("./company.js");
const jobRouter = require('./post_job_vaccancies.js');

// Use routes
router.use("/users", userRouter);
router.use("/company", companyRouter);
router.use("/job", jobRouter);

module.exports = router
