const _ = require('lodash');
const queries = require('./queries');
const { Users: User } = require('../../db');

async function getUser(req, res, next) {
    // find username first from the auth token
    try {
        const user = await User.findOne(req.user).exec();
        res.status(200).json(queries.getUser(user));
    } catch (e) {
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
        res.status(200).json(queries.getUser(user));        
    } catch(e) {
        res.status(400).json({ message: 'User already exists' });
    }
}

async function updateUser(req, res, next) {
    try {
        await User.updateOne(req.user, req.parsedParams).exec();
        res.status(200).json({ message: 'User updated' });        
    } catch (e) {
        res.status(400).json({
            message: 'Password is required field'
        });
    }
}

module.exports = {
    getUser,
    createUser,
    updateUser,
};