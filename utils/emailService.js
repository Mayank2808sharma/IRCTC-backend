const transporter = require('../config/emailConfig');


const sendBasicEmail = async ( mailTo, mailSubject, mailBody) => {
    try {
        const response = await transporter.sendMail({
            from: {
                name: 'IRCTC Backend Service',
                address: "irctc-backend-service@gmail.com"
            },
            to: mailTo,
            subject: mailSubject,
            text: mailBody
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendBasicEmail;