const express = require('express');

const router = express.Router();

const { sendConnectionRequest, acceptConnectionRequest, getConnections,getConnectionByStatus
} = require("../controllers/connection.js");

const { userAuth } = require("../middleware/authentication.js");

// send a connection request
router.route('/request').post(userAuth, sendConnectionRequest);

// accept a request
router.route('/:id').get(userAuth, acceptConnectionRequest);

// get all connections
router.route('/all').post(userAuth, getConnections);

// get connection status by sender and receiver
router.route('/status/get').get(userAuth, getConnectionByStatus);

module.exports = router;