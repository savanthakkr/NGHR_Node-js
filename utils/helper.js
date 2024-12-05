const fs = require('fs');
const path = require('path');

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

async function saveBase64File(file, folderPath) {
    const fileName = `${Date.now()}_${file.name}`;
    const filePath = path.join(folderPath, fileName);

    file.mv(filePath, (err) => {
        if (err) {
            throw new Error('Error saving file: ' + err);
        }
    });

    return filePath;
};

module.exports = {
    saveBase64File
};
