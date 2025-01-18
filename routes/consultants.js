const express = require('express');
const router = express.Router();
const { signup,
    signin,
    addExperience,
    addProjects,
    addCertificatesAndLicense,
    getConsultantById,
    updateProfileById,
    getConsultantList,
    updateProfilePreferenceById,
    updateProfileDocumentsById,
    getUserByAuthToken
} = require('../controllers/consultants.js');
const { userAuth } = require('../middleware/authentication.js');

// conditional auth
const conditionalAuth = (req, res, next) => {
    if (req.body.skipAuth === true) {
        return next();
    } else {
        return userAuth(req, res, next);
    }
};

const projectConditionalAuth = (req, res, next) => {
    if (req.body.some(project => project?.skipAuth === true)) {
        return next();
    } else {
        return userAuth(req, res, next);
    }
};

// sign up
router.route('/signup').post(signup);

// sign in
router.route('/signin').post(signin);

// add experience
router.route('/experience').post(conditionalAuth, addExperience);

// add project
router.route('/add/project').post(projectConditionalAuth, addProjects);

// add certificates
router.route('/add/certificates/document').post(projectConditionalAuth, addCertificatesAndLicense);

// get consultant data by id
router.route('/:id').get(userAuth, getConsultantById);

// update profile by id
router.route('/update').put(userAuth, updateProfileById);

// update profile preference
router.route('/update/preference').put(userAuth, updateProfilePreferenceById);

// update license and certificates
router.route('/update/document/license').put(userAuth, updateProfileDocumentsById);

// get consultant list
// router.route('/list').post(userAuth, getConsultantList);
router.route('/list').post(getConsultantList);

// get consultant by id
router.route('/auth/user').get(userAuth, getUserByAuthToken);
module.exports = router;
