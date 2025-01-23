const express = require('express');
const bodyParser = require('body-parser');
const useRoutes = require('./routes/index');
const { QueryTypes } = require('sequelize');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const testConnection = require('./database/index');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const path = require('path');
const http = require('http');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
// const { googleLogin } = require('./controllers/userController');
// const { broadcastMessage, socketFunction } = require('./controllers/soketController');

const sessionConfig = {
    secret: 'secret',
    resave: false,
    saveUninitialized: true
};

const app = express();
const PORT = 3305;

app.use(express.json({ limit: '100mb' }));
app.use(bodyParser.json({ limit: '100mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));
app.use(cors());
// app.use(cors({
//     origin: 'https://nghr.fullstackresolutions.com',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     credentials: true
// }));
app.use(fileUpload());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());


app.use('/api', useRoutes);
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// Test the database connection
testConnection()
// testConnection()
//     .then(() => {
//         // Routes
//         app.use('/api', useRoutes);

//         app.get('/api/auth/google', passport.authenticate('google', {
//             scope: ['profile', 'email']
//         }));

//         const server = http.createServer(app);
//         socketFunction(server);

//         server.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     })
//     .catch(err => {
//         console.error('Unable to start server:', err);
//     });

// module.exports = { broadcastMessage };
