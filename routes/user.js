const express = require('express');
const router = express.Router();

const { userRegister, signIn , addUserDocument } = require("../controllers/users.js");

// sign in
router.route('/signin').post(signIn);

// sign up
router.route('/signup').post(userRegister);

// users upload documents
router.route('/upload-document').post(addUserDocument);
module.exports = router;