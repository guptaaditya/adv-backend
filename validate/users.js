const moment = require('moment');
const constants = require('../constants');
const { Users: User, VerificationCodes } = require('../db');
const { verifyJwt } = require('../Controller/Auth/jwtUtils');
const { hashPass } = require('../helper');
const { validate } = require('./utils');

function createUser(req, res, next) {
    const permittedParams = ['username', 'password', 'firstname', 'lastname', 'timezone'];
    const mandatoryParams = ['username', 'password', 'firstname', 'lastname'];
    if(validate(permittedParams, req, res, mandatoryParams)) {
        next();
    }
}

async function updateUser(req, res, next) {
    const permittedParams = ['name', 'password', 'timezone'];
    if(validate(permittedParams, req, res)) {
        if (req.parsedParams.password) {
            const hashedPassword = await hashPass(req.parsedParams.password);
            req.parsedParams.password = hashedPassword;
        }
        next();
    }
}

async function verifyEmail(req, res, next) {
    const { verificationToken } = req.params;
    try {
        const decodedJwt = await verifyJwt(verificationToken);
        if(decodedJwt) {
            const userId = decodedJwt[constants.VERIFY_EMAIL_KEY];
            req.parsedParams = { userId };
            next();
        }
    } catch (e) {
        console.error(e);
        res.status(400).json({ message: 'The link is invalid' });
    }
}

async function getUserVerificationCode(req, res, next) {
    const { username } = req.params;
    try {
        const user = await User.findOne({ username }).exec();
        if (user.username) {
            req.parsedParams = { username: user.username };
            return next();
        }
        res.status(400).json({ message: 'Username not found' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function verifyVerificationCode(req, res, next) {
    const permittedParams = ['username', 'verificationCode'];
    const mandatoryParams = ['username', 'verificationCode'];
    if (validate(permittedParams, req, res, mandatoryParams)) {
        try {
            const { username, verificationCode } = req.parsedParams;
            const code = await VerificationCodes.findOne({ 
                username, 
                isUsed: false, 
                createdOn: { 
                    $gte: moment.utc().subtract(
                        constants.EXPIRY_VERIFICATION_CODE_MINUTES, 'minutes'
                    )
                }
            }).exec();
            if (!code) {
                return res.status(401).send({ message: "Invalid request parameters" });
            }
            const isMatch = await code.compareCode(verificationCode);
            if(!isMatch) {
                return res.status(401).send({ message: "Invalid verification code" });
            } else {
                next(); // Successfully issue a token for user and then update the verification
            }
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Server Error' });
        }
    }
}

module.exports = {
    createUser,
    updateUser,
    getUserVerificationCode,
    verifyVerificationCode,
    verifyEmail,
}