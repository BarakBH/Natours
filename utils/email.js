const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    // const transporter = nodemailer.createTransport({
    //     service: 'Gmail',
    //     auth: {
    //         user: process.env.GMAIL_USERNAME,
    //         pass: process.env.GMAIL_PASSWORD
    //     }
    //              NEED TO ACTIVATE LESS SECURE CODE IN GMAIL BUT THINGS HAVE CHANGED SINCE 22 SO NEED TO LOOK IT UP SOMETIME
    // });

    // WE WILL USE MAILTRAP FOR DEVELOPMENT SERVICE
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // 2) Define the email options
    const mailOptions = {
        from: 'Barak Ben Hamo <barakNatoursApp@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    // 3) Actually send the email
    await transporter.sendMail(mailOptions)
};

module.exports = sendEmail;
