const fs = require('fs');
const path = require('path');

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
        const folderPath = path.join(__dirname, '..', folder);
        const filePath = path.join(folderPath, fileName);

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }

        fs.writeFileSync(filePath, base64Data, { encoding: "base64" });
        console.log(`File saved: ${filePath}`);

        return filePath;
    } catch (error) {
        console.error("Error saving Base64 file:", error);
        throw error;
    }
}

module.exports = {
    saveBase64File
};
