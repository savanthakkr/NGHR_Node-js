const express = require('express');
const router = express.Router();

// Import routes
const userRouter = require("./user.js");
const companyRouter = require("./company.js");
const jobRouter = require('./post_job_vaccancies.js');
const consultantRouter = require('./consultants.js')
// Use routes
router.use("/users", userRouter);
router.use("/company", companyRouter);
router.use("/job", jobRouter);
router.use("/consultant", consultantRouter);

module.exports = router
