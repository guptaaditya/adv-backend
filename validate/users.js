const moment = require('moment');
const constants = require('../constants');
const { Users: User, VerificationCodes } = require('../db');
const { hasValidPermittedParams } = require('./utils');
const { hashPass } = require('../helper');

function validate(permittedParams, req, res) {
    const nonEmptyParams = hasValidPermittedParams(permittedParams, req.body);
    if (!nonEmptyParams) {
        res.status(400).json({ message: 'No valid value found' });     
    }
    req.parsedParams = nonEmptyParams;
}

function createUser(req, res, next) {
    const permittedParams = ['username', 'password', 'firstname', 'lastname', 'timezone'];
    validate(permittedParams, req, res);
    next();
}

async function updateUser(req, res, next) {
    const permittedParams = ['name', 'password', 'timezone'];
    validate(permittedParams, req, res);
    if (req.parsedParams.password) {
        const hashedPassword = await hashPass(req.parsedParams.password);
        req.parsedParams.password = hashedPassword;
    }
    next();
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
        res.status(500).json({ message: 'Server Error' });
    }
}

async function verifyVerificationCode(req, res, next) {
    const permittedParams = ['username', 'verificationCode'];
    validate(permittedParams, req, res);
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
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    createUser,
    updateUser,
    getUserVerificationCode,
    verifyVerificationCode,
}