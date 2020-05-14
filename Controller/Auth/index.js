const _ = require('lodash');
const md5 = require('md5');

const constants = require('../../constants');
const { getJwt, verifyJwt } = require('./jwtUtils');
const { Users: User, VerificationCodes } = require('../../db');
const { sendEmail } = require('../../helper');
 
async function getUserLogIn(req, res, next) {
    const { username, password } = req.loginCredentials;
    const { remember = false } = req.body;
    const user = await User.findOne({ username }).exec();
    if(!user) {
        return res.status(400).json({ message: "The username does not exist" });
    }
    try {
        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            return res.status(400).json({ message: "The password is invalid" });
        }
        
        let tokenExpiry = constants.EXPIRY_LOGIN_SHORT_TERM_TOKEN;
        if (remember) {
            tokenExpiry = constants.EXPIRY_LOGIN_LONG_TERM_TOKEN;
        }

        const token = await getJwt({ username, usertype: user.role }, tokenExpiry);
        return res.status(200).send(token);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "The server failed to validate password" });
    }
}

function preAuthentication(req, res, next) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    const base64Credentials =  req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    req.loginCredentials = { username: username.trim(), password: password.trim() };
    if (!username || !password) {
        return res.status(401).json({ message: 'Invalid Authentication token' });
    }
    next();
}


async function preAuthorization(req, res, next) {
    if (!req.headers.authorization || req.headers.authorization.indexOf('Bearer ') === -1) {
        return res.status(401).json({ message: 'Missing Authorization Header' });
    }
    const token =  req.headers.authorization.split(' ')[1];
    try {
        const { username, usertype } = await verifyJwt(token);
        if (!username) {
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = { username, role: usertype };
        next();
    } catch (e) {
        console.error(e);
        return res.status(401).json({ message: 'Invalid token. Token has expired' });
    }
}

async function getUserVerficiationCode(req, res, next) {
    const { username } = req.parsedParams;
    const code = md5(`${username}---${Date.now()}`);
    try {
        const saveVCode = await VerificationCodes.create({ 
            username, 
            code,
        });
        if (!saveVCode) {
            throw new Error('Failed to save verification code to be sent to user');
        }
        const subject = 'Verification Code from UTV';
        const html = `<p>Please use the code ${code} for verification on UTV</p>`;
        const email = await sendEmail(username.trim(), subject, html);
        if (email.messageId) {
            console.log(`Email sent to ${username}`, email.messageId);
            return res.status(200).json({ message: 'An email has been sent to your provided email' });
        }
        res.status(500).json({ message: 'Failed to send email to the recipient' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function getResetPassToken(req, res, next) {
    const { username } = req.parsedParams;
    try {
        const tokenExpiry = `${constants.EXPIRY_RESET_TOKEN_MINUTES}m`;
        const token = await getJwt({ username }, tokenExpiry);
        res.status(200).send(token);
        await VerificationCodes.updateOne({ username, isUsed: false }, { isUsed: true }).exec();
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    getUserLogIn,
    preAuthentication,
    preAuthorization,
    getUserVerficiationCode,
    getResetPassToken,
};