const express = require('express');

const router = express.Router();
const { userAuth } = require("../middleware/authentication.js")

const { signup, signIn, getCompanyUserByAuthToken,
    updateUserProfile, getCompanyList, getCompanyById,
    scheduleGoogleMeet, sendConnectionRequest, acceptConnectionRequest,
    getConnections
} = require('../controllers/companies.js');

// sign up
router.route('/signup').post(signup);

// sign in
router.route('/signin').post(signIn);

// get profile 
router.route('/user').get(userAuth, getCompanyUserByAuthToken);

// update profile
router.route('/update').put(userAuth, updateUserProfile);

// get company list
router.route('/list').post(userAuth, getCompanyList);

// get company by id
router.route('/:id').get(userAuth, getCompanyById);

// schedule google meet
router.route('/generate-link').post(userAuth, scheduleGoogleMeet);

// send a connection request
router.route('/connections/request').post(userAuth, sendConnectionRequest);

// accept a request
router.route('/connections/:id/accept').put(userAuth, acceptConnectionRequest);

// get all connections
router.route('/connections/all').get(userAuth, getConnections);
module.exports = router;