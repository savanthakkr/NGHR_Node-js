const express = require('express');

const router = express.Router();
const { userAuth } = require("../middleware/authentication.js")

const { signup, signIn ,getCompanyUserByAuthToken,
    updateUserProfile
} = require('../controllers/companies.js');


// sign up
router.route('/signup').post(signup);

// sign in
router.route('/signin').post(signIn);

// get profile 
router.route('/user').get(userAuth, getCompanyUserByAuthToken);

// update profile
router.route('/update').put(userAuth, updateUserProfile);


module.exports = router;