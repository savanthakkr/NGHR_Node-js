const fs = require('fs');
const path = require('path');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const moment = require('moment');
const { google } = require('googleapis');
const serviceAccount = require('./service-account-key.json');
const { GoogleAuth } = require('google-auth-library');
const { v4: uuidv4 } = require('uuid');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

async function saveBase64File(base64String, folder) {
    try {
        const matches = base64String.match(/^data:(.+);base64,(.+)$/);

        if (!matches || matches.length !== 3) {
            throw new Error("Invalid Base64 string");
        }

        const fileType = matches[1].split("/")[1];
        const base64Data = matches[2];
        const fileName = `${Date.now()}.${fileType}`;
        const folderPath = "uploads";
        const filePath = path.join(folderPath, fileName);

        const finalFilePath = filePath.replace(/\\/g, '/');

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(finalFilePath, base64Data, { encoding: "base64" });
        console.log(`File saved: ${finalFilePath}`);

        // return finalFilePath;
        return `${process.env.FRONTEND_IMAGE_PATH}${finalFilePath}`;
    } catch (error) {
        console.error("Error saving Base64 file:", error);
        throw error;
    }
}

// GenerateToken
const generateToken = (user) => {
    return jwt.sign({ email: user.email }, 'crud', { expiresIn: '24h' });
};

// get date range 
const getDateRange = (period) => {
    let startDate, endDate;

    if (period === 'last_week') {
        startDate = moment().subtract(1, 'weeks').startOf('week').startOf('day');
        endDate = moment().subtract(1, 'weeks').endOf('week').endOf('day');
    } else if (period === 'last_month') {
        startDate = moment().subtract(1, 'months').startOf('month').startOf('day');
        endDate = moment().subtract(1, 'months').endOf('month').endOf('day');
    } else if (period === 'last_year') {
        startDate = moment().subtract(1, 'years').startOf('year').startOf('day');
        endDate = moment().subtract(1, 'years').endOf('year').endOf('day');
    }

    return { startDate: startDate.toDate(), endDate: endDate.toDate() };
};

const auth = new GoogleAuth({
    credentials: serviceAccount, // Path to your service account key file
    scopes: [
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/calendar.events',
    ],
});

// Initialize Google Calendar API client
const generateGoogleMeetLink = async ({ summary, startDateTime, endDateTime }) => {
    const calendar = google.calendar({ version: 'v3', auth });

    try {
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        // Validate input dates
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid start or end time format.');
        }

        // Event object
        const event = {
            summary,
            start: {
                dateTime: start.toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            end: {
                dateTime: end.toISOString(),
                timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
                createRequest: {
                    requestId: uuidv4(),  // Unique request ID
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',  // Corrected conference type
                    },
                },
            },
        };

        // Insert the event into the calendar
        const response = await calendar.events.insert({
            calendarId: 'primary',  // Use a specific calendar ID if needed
            resource: event,
            conferenceDataVersion: 1,
        });

        const googleMeetLink = response.data.hangoutLink;
        const googleEventId = response.data.id;

        console.log('Google Meet Link:', googleMeetLink);
        console.log('Event ID:', googleEventId);

        return {
            meetLink: googleMeetLink,
            eventId: googleEventId,
        };
    } catch (error) {
        console.error('Error generating Google Meet link:', error.message);
        throw new Error('Failed to generate Google Meet link.');
    }
};

module.exports = {
    saveBase64File,
    generateToken,
    getDateRange,
    generateGoogleMeetLink
};
