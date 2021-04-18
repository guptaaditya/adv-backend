const _ = require('lodash');
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
        secure: true,
        service: 'sendgrid',
        host: "smtp.sendgrid.net",
        auth: {
            user: 'apikey',
            pass: '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'
        }
    });

    const mailOptions = {
        from: 'usertoviews@gmail.com',
        to: recipient,
        subject,
        html
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (e) {
        console.error(e, 'Failed to send email', JSON.stringify(mailOptions), transporter);
    }
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

function promisifyFunc(asyncFunc) {
    return new Promise((resolve, reject) => {
        asyncFunc((err, ...args) => {
            if (err) reject (err);
            resolve(args);
        });
    })
}

function getRandomLinkHash() {
    const firstRandom = _.random(10, 36);
    const secondRandom = _.random(10, 36);
    return (new Date()).getTime().toString(firstRandom) + Math.random().toString(secondRandom).slice(14);
}

function getRandomUserReferralCode() {
    const firstRandom = _.random(7, 9);
    const secondRandom = _.random(7, 9);
    return (new Date()).getTime().toString(firstRandom) + Math.random().toString(secondRandom).slice(25);
}

function getProxyServiceDomain() {
    return `${process.env.SHORT_LINK_DOMAIN}/`;
}

function getApiServiceDomain() {
    return `${process.env.MAIN_BACKEND_API_DOMAIN}/`;
}

module.exports = {
    hashPass,
    sendEmail,
    hashVerify,
    initializeHelpers,
    getRequestUrl,
    promisifyFunc,
    getRandomLinkHash,
    getRandomUserReferralCode,
    getProxyServiceDomain,
    getApiServiceDomain,
};