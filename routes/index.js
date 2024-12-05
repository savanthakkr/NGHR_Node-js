const express = require('express');
const router = express.Router();

// Import routes
const userRouter = require("./user.js");

// Use routes
router.use("/users", userRouter);

module.exports = router
