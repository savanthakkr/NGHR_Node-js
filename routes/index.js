const express = require('express');
const router = express.Router();

// Import routes
const userRouter = require("./user.js");
const companyRouter = require("./company.js");
const jobRouter = require('./post_job_vaccancies.js');
const consultantRouter = require('./consultants.js');
const connectionRouter = require('./connection.js');
const messageRouter = require('./messages.js');

// Use routes
router.use("/users", userRouter);
router.use("/company", companyRouter);
router.use("/job", jobRouter);
router.use("/consultant", consultantRouter);
router.use("/connection", connectionRouter);
router.use("/chat", messageRouter);


module.exports = router
