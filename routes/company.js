const express = require('express');

const router = express.Router();
const { userAuth } = require("../middleware/authentication.js")

const { signup, signIn, getCompanyUserByAuthToken,
    updateUserProfile, getCompanyList, getCompanyById,
    scheduleGoogleMeet, companySavedConsultant,
    getCompanySavedConsultant,
    addSearchCandidate,
    getConsultantApplyjobList,
    changeConsultantApplyJobStatus
} = require('../controllers/companies.js');

const conditionalAuth = (req, res, next) => {
    if (req.body.skipAuth === true) {
        return next();
    } else {
        return userAuth(req, res, next);
    }
};
// sign up
router.route('/signup').post(signup);

// sign in
router.route('/signin').post(signIn);

// get profile 
router.route('/user').get(userAuth, getCompanyUserByAuthToken);

// update profile
router.route('/update').put(conditionalAuth, updateUserProfile);

// get company list
router.route('/list').post(userAuth, getCompanyList);

// get company by id
router.route('/:id').get(userAuth, getCompanyById);

// schedule google meet
router.route('/generate-link').post(userAuth, scheduleGoogleMeet);

// save consultant
router.route('/save/consultant').post(userAuth, companySavedConsultant);

// get user saved job
router.route('/save/job').get(userAuth, getCompanySavedConsultant);

// add search candidate
router.route('/add/search/candidate').post(userAuth, addSearchCandidate);

// apply consultant list
router.route('/get/consultant/job/list').post(userAuth, getConsultantApplyjobList);

// company change consultant list
router.route('/get/consultant/change/job/status').post(userAuth, changeConsultantApplyJobStatus);

module.exports = router;