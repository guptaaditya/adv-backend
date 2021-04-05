const _ = require('lodash');
const queries = require('./queries');
const { getJwt } = require('../Auth/jwtUtils');
const { Users: User } = require('../../db');
const { sendEmail, getApiServiceDomain } = require('../../helper');
const constants = require('../../constants');

async function getUser(req, res, next) {
    // find username first from the auth token
    try {
        const user = await User.findOne(req.user).exec();
        res.status(200).json(queries.getUser(user));
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function createUser(req, res, next) {
    const { firstname, lastname, ...otherParams } = req.parsedParams;
    try {
        const user = await User.create({ 
            ...otherParams, 
            name: (`${firstname || ''} ${lastname}`.trim())
        });

        const userDetails = queries.getUser(user);
        const token = await getJwt(
            { 
                [constants.VERIFY_EMAIL_KEY]: user.id 
            }, 
            constants.EXPIRY_VERIFY_EMAIL
        );
        const link = `${getApiServiceDomain()}user/verify/${token}`
        const subject = 'Verification Email from UTV';
        const html = `<p>Please click the below given link for verification \n ${link}</p>`;
        try {
            const email = await sendEmail(otherParams.username.trim(), subject, html);
            if (email.messageId) {
                console.log(`Email sent to ${otherParams.username}`, email.messageId);
                res.status(200).json({
                    ...userDetails,
                    displayMessage: 'An email has been sent to your provided email',
                });  
                return;      
            }
            console.log(`Failed to send verification email to the user ${otherParams.username}`)
        } catch (e) {
            console.error('Error sending verification email', 'The user verification link is'+link, e);
        }
        res.status(200).json({ 
            ...userDetails,
        });
    } catch(e) {
        console.error(e);
        res.status(409).json({ message: 'User already exists' });
    }
}

async function verifyUserEmail(req, res, next) {
    const { userId } = req.parsedParams;
    try {
        await User.updateOne({ _id: userId }, { isVerified: true }).exec();
        res.redirect(303, '/');        
    } catch (e) {
        console.error(e);
        res.send('An event has been logged. You are using an Invalid Verification Link');
    }
}

async function updateUser(req, res, next) {
    try {
        await User.updateOne(req.user, req.parsedParams).exec();
        res.status(200).json({ message: 'User updated' });        
    } catch (e) {
        console.error(e);
        res.status(400).json({
            message: 'Password is required field'
        });
    }
}

module.exports = {
    getUser,
    createUser,
    updateUser,
    verifyUserEmail,
};