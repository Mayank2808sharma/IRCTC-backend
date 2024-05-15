const nodemailer= require('nodemailer');


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.process.env.EMAIL_PASS,
        pass: process.env.EMAIL_PASS
    }
});

module.exports =    transporter;