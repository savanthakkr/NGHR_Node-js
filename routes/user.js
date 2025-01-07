const express = require('express');
const router = express.Router();

const { userRegister, signIn, addUserDocument,
    addUserEducation, addUserExperience, getUserByAuthToken, updateUser,
    updateUserPreferences, getUserPreferences, getUserExperience, getUserJob,
    userSavedJob, getUserSavedJob, addUserResume, getUserResume, applyJob,
    getUserListByJobId, getUserById, signOut, updateUserExperience,
    getUserEduction
} = require("../controllers/users.js");
const { userAuth } = require("../middleware/authentication.js");

const conditionalAuth = (req, res, next) => {
    if (req.body.some(experience => experience?.skipAuth === true)) {
        return next();
    } else {
        return userAuth(req, res, next);
    }
};

// Route definition
router.route('/user_experience').post(conditionalAuth, addUserExperience);


// sign in
router.route('/signin').post(signIn);

// sign up
router.route('/signup').post(userRegister);

// users upload documents
router.route('/upload_document').post(addUserDocument);

// add user eduction
router.route('/user_eduction').post(addUserEducation);

// add user experience
// router.route('/user_experience').post(userAuth, addUserExperience);
router.route('/user_experience').post(conditionalAuth, addUserExperience);

// update user experience
router.route('/update_experience').put(userAuth, updateUserExperience);

// get user by id
router.route('/user_by_auth_token').get(userAuth, getUserByAuthToken);

// update user
router.route('/update').put(userAuth, updateUser);

// update user profile preferences
router.route('/update/preferences').put(userAuth, updateUserPreferences);

// user preferences by id
router.route('/get/preferences').get(userAuth, getUserPreferences);

// user experience by id
router.route('/experience/:id').get(userAuth, getUserExperience);

// user eduction by id
router.route('/eduction/:id').get(userAuth, getUserEduction);

// get user job
// router.route('/list').post(userAuth, getUserJob);
router.route('/list').post(getUserJob);

// user saved job
router.route('/save/job').post(userAuth, userSavedJob);

// get user saved job
router.route('/save/job').get(userAuth, getUserSavedJob);

// add user resume
router.route('/resume').post(userAuth, addUserResume);

// get user resume
router.route('/resume/:id').get(userAuth, getUserResume);

// apply job
router.route('/apply_job').post(userAuth, applyJob);

// get user list by job id
router.route('/list/job-id').post(userAuth, getUserListByJobId);

// get user by id
router.route('/:id').get(getUserById);

// user sign out 
router.route('/log-out').post(userAuth, signOut);


module.exports = router;