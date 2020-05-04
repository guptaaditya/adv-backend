const queries = require('../Users/queries');
const { Users: User, Payments: Payment } = require('../../db');

async function getUserMembership(req, res, next) {
    try {
        const user = await User.findOne(req.user).exec();
        res.status(200).json(queries.getMembership(user.membership));
    } catch (e) {
        console.error(e);
        res.status(401).json({ message: 'Invalid request' });
    }
}

async function upgradeUserMembership(req, res, next) {
    const { resource: { custom } = {} } = req.body; 
    const username = custom.trim();
    if (!username) {
        res.send(400).json({ message: 'username not found in custom resource field' });
    }
    try {
        const paymentRecorded = await Payment.create({
            username,
            info: req.body,
        });
        if (paymentRecorded) {
            return res.status(200).json({ message: 'Transaction recorded' });
        }
        return res.status(500).json({ message: 'Transaction recording failed' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    getUserMembership,
    upgradeUserMembership,
}