const fs = require('fs');
const path = require('path');
var jwt = require('jsonwebtoken');

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

        return finalFilePath;
    } catch (error) {
        console.error("Error saving Base64 file:", error);
        throw error;
    }
}

// GenerateToken
const generateToken = (user) => {
    return jwt.sign({ email: user.email }, 'crud', { expiresIn: '24h' });
};

module.exports = {
    saveBase64File,
    generateToken
};
