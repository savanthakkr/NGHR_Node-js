const express = require('express');

const router = express.Router();

const {
    addMessages,
    updateMessage,
    deleteMessage,
    readMessage,
    getAllUsersLastMessage,
    getMessagesByRoomId,
    searchUser
} = require("../controllers/messages.js");

// add messages
router.route('/add').post(addMessages);

// update messages
router.route('/update').put(updateMessage);

// delete messages
router.route('/delete/update').put(deleteMessage);

// read messages
router.route('/read/message/update').put(readMessage);

// get message by room id
router.route('/get/chat').post(getMessagesByRoomId);

// get all user last message
router.route('/get/all/user/lastmessage').post(getAllUsersLastMessage);

// search user
router.route('/get/search/user').post(searchUser);

module.exports = router;