const express = require('express');
const router = express.Router();

// Import routes
const userRouter = require("./user.js");
const companyRouter = require("./company.js");

// Use routes
router.use("/users", userRouter);
router.use("/company", companyRouter);

module.exports = router
