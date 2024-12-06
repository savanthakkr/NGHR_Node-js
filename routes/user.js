const express = require('express');
const router = express.Router();

const { userRegister, signIn, addUserDocument,
    addUserEducation, addUserExperience
} = require("../controllers/users.js");

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


module.exports = router;