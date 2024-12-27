const fs = require('fs');
const path = require('path');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const moment = require('moment');
const { google } = require('googleapis');
const serviceAccount = require('./service-account-key.json');
const { GoogleAuth } = require('google-auth-library');
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

// generate google meet link
// const auth = new google.auth.GoogleAuth({
//     credentials: serviceAccount,
//     scopes: ['https://www.googleapis.com/auth/calendar'],
// });

const auth = new GoogleAuth({
    keyFile: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/calendar.events'],
});

const calendar = google.calendar({ version: 'v3', auth });

const generateGoogleMeetLink = async ({ summary, startDateTime, endDateTime }) => {
    try {
        const start = new Date(startDateTime);
        const end = new Date(endDateTime);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            throw new Error('Invalid start or end time format.');
        }

        const event = {
            summary: summary,
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
                    requestId: 'random-string',
                    conferenceSolutionKey: {
                        type: 'hangoutsMeet',
                    },
                    status: {
                        statusCode: 'success',
                    },
                },
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });

        console.log('response.data >>', response.data)
        const googleMeetLink = response.data.hangoutLink;
        const googleEventId = response.data.id;

        const newEvent = await Event.create({
            summary: summary,
            startTime: start,
            endTime: end,
            meetLink: googleMeetLink,
            googleEventId: googleEventId,
        });

        return {
            meetLink: googleMeetLink,
            eventDetails: newEvent,
        };
    } catch (error) {
        console.error('Error generating Google Meet link:', error);
        throw new Error('Failed to generate Google Meet link.');
    }
};



module.exports = {
    saveBase64File,
    generateToken,
    getDateRange,
    generateGoogleMeetLink
};
