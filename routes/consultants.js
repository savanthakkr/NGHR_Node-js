const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/consultants.js');

// sign up
router.route('/signup').post(signup);

module.exports = router;