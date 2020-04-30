const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const SALT = 10;

function hashPass(pass) {
    const returnValue = bcrypt.hash(pass, SALT);
    return returnValue;
}

function hashVerify(providedPass, availablePass) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(providedPass, availablePass, function(err, isMatch) {
            if(err) return reject(err);
            resolve(isMatch);
        });
    })
}

async function sendEmail(recipient, subject = '', html) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        auth: {
            user: 'usertoviews@gmail.com',
            pass: 'Lannister@123'
        }
    });

    const mailOptions = {
        from: 'usertoviews@gmail.com',
        to: recipient,
        subject,
        html
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
}

function initializeHelpers() {
    global.btoa = str => Buffer.from(str).toString('base64');
    global.atob = encoded => Buffer.from(encoded, 'base64').toString();
}

function getRequestUrl(req) {
    const { protocol, headers: { host }, originalUrl } = req;
    const reqUrl = protocol+'://'+host+originalUrl;
    return reqUrl;
}

module.exports = {
    hashPass,
    sendEmail,
    hashVerify,
    initializeHelpers,
    getRequestUrl,
};