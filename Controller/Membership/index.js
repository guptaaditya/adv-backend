const queries = require('../Users/queries');
const { Users: User, Payments: Payment, Orders: Order } = require('../../db');
const constants = require('../../constants');
const { verifyOrder } = require('./paypalOrderVerification');

async function getUserMembership(req, res, next) {
    try {
        const user = await User.findOne(req.user).exec();
        res.status(200).json(queries.getMembership(user.membership));
    } catch (e) {
        console.error(e);
        res.status(401).json({ message: 'Invalid request' });
    }
}

async function upgradeMembership(username) {
    const paidMembershipDetails = { ...constants.PAID_MEMBERSHIP };
    var validityTill = new Date();
    validityTill.setMonth( validityTill.getMonth() + 1 );
    paidMembershipDetails.validTill = validityTill;

    const updateMembership = await User.updateOne(
        { username, isDeleted: false }, 
        { membership: paidMembershipDetails },
    ).exec();
    return updateMembership;
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
            const updateMembership = await upgradeMembership(username);
            if (updateMembership.nModified === 1) {
                return res.status(200).json({ message: 'Transaction recorded' });
            }
        }
        return res.status(500).json({ message: 'Transaction recording failed' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function verifyOrderAndUpgradeMembership(req, res, next) {
    const { order } = req.parsedParams;
    const { username } = req.user;
    try {
        const orderDetails = await verifyOrder(order.orderID);
        if(orderDetails.status === 'COMPLETED') {
            const orderId = await Order.create({
                username,
                paymentFromUser: order,
                orderDetailsFromPaypal: orderDetails,
            });
            const updateMembership = await upgradeMembership(username);
            if(orderId && updateMembership.nModified === 1) {
                res.status(200).json({ displayMessage: 'Order verified successfully, upgrading your membership'});
                return;
            }
            console.error('----------', orderDetails, order, '--------------');
        }
        res.status(500).json({ displayMessage: 'Order could not be verified. It might take some time to upgrade your membership'});
    } catch (e) {
        console.error(e);
        if(e.statusCode) {
            res.status(e.statusCode).json({ 
                displayMessage: JSON.parse(e.message).message,
            });
            return;
        }
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    getUserMembership,
    upgradeUserMembership,
    verifyOrderAndUpgradeMembership,
}