
const {
    companies: companiesSchema
} = require("../models/index.js");
const { saveBase64File } = require("../utils/helper.js");

// signup
const signup = async (req, res) => {
    try {
        const bodyData = req?.body;

        const existingEmail = await companiesSchema.findOne({
            where: {
                email: bodyData?.email,
            }
        });

        if (existingEmail) {
            return res.status(400).json({ error: true, message: 'Email already exists!' });
        }

        if (!bodyData?.aadhar_front || !bodyData?.aadhar_back || !bodyData?.pan_card) {
            return res.status(400).json({ error: true, message: 'All document fields are required!' });
        }

        const afPath = await saveBase64File(bodyData?.aadhar_front, 'uploads');
        const abPath = await saveBase64File(bodyData?.aadhar_back, 'uploads');
        const panPath = await saveBase64File(bodyData?.pan_card, 'uploads');

        const dataToSave = {
            ...bodyData,
            company_name: bodyData?.company_name?.value,
            company_type: bodyData?.company_type?.value,
            aadhar_front: afPath,
            aadhar_back: abPath,
            pan_card: panPath,
        };

        // Save data to the database
        const data = await companiesSchema.create(dataToSave);

        return res.status(200).json({
            error: false,
            message: 'Registration successful!',
            data: data,
        });
    } catch (error) {
        console.error("Error during company signup!!:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = {
    signup
}