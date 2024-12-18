const express = require('express');
const router = express.Router();

const { userRegister, signIn, addUserDocument,
    addUserEducation, addUserExperience, getUserByAuthToken, updateUser,
    updateUserPreferences, getUserPreferences, getUserExperience, getUserJob,
    userSavedJob,getUserSavedJob
} = require("../controllers/users.js");
const { userAuth } = require("../middleware/authentication.js");

// sign in
router.route('/signin').post(signIn);

// sign up
router.route('/signup').post(userRegister);

// users upload documents
router.route('/upload_document').post(addUserDocument);

// add user eduction
router.route('/user_eduction').post(addUserEducation);

// add user experience
router.route('/user_experience').post(addUserExperience);

// get user by id
router.route('/user_by_auth_token').get(userAuth, getUserByAuthToken);

// update user
router.route('/update').put(userAuth, updateUser);

// update user profile preferences
router.route('/update/preferences').put(userAuth, updateUserPreferences);

// user preferences by id
router.route('/get/preferences').get(userAuth, getUserPreferences);

// user experience by id
router.route('/experience').get(userAuth, getUserExperience);

// get user job
router.route('/list').post(userAuth, getUserJob);

// user saved job
router.route('/save/job').post(userAuth, userSavedJob);

// get user saved job
router.route('/save/job').get(userAuth, getUserSavedJob);

module.exports = router;