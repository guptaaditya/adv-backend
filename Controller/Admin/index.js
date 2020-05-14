const _ = require('lodash');
const constants = require('../../constants');
const { Users: User } = require('../../db');
const adminUtils = require('./utils');
const queries = require('./queries');
const { sendPayouts } = require('./payoutsClient');

async function findPayouts() {
    const initDate = adminUtils.getFirstDateOfCurrentMonth();
    const currentDate = new Date();
    const newUsersRegistered = await User.aggregate(
        [
            { 
                $match: { 
                    registeredOn: { $gte: initDate }, 
                    "membership.validTill": { $ne: null, $gte: currentDate }, 
                    referredBy: { $ne: null } 
                } 
            },
            {
                $graphLookup: {
                    from: "users",
                    startWith: "$referredBy",
                    connectFromField: "referredBy",
                    connectToField: "username",
                    as: "referralHierarchy"
                 }
            }
        ]
    );
    return queries.getPayoutsMap(newUsersRegistered);
}
async function getAMonthsPayouts(req, res, next) {
    /*
        1. Get users registered in current month
            // Get first date of current month
            // Find users registered after that date.
        2. Get who these users were referred by.
        3. Get who the users in step 2 were referred by.
        4. The users found in step 1 are L1 for users found in 2. step
        5. The users found in step 1 are L2 for users found in 3. step
    */
    try {
        const newUsersRegistered = await findPayouts();
        res.status(200).json(newUsersRegistered);
        return;
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Server Error' });
    }
}

async function sendAMonthsPayouts(req, res, next) {
    try {
        const newUsersRegistered = await findPayouts();
        const currMonth = adminUtils.getCurrentMonthName();
        const payoutItems = queries.getPayoutItemsForPaypal(newUsersRegistered, currMonth);
        const payoutBody = queries.getPayoutsObject(payoutItems, currMonth);
        const paypalResponse = await sendPayouts(payoutBody);
        if(paypalResponse) {
            res.status(200).json();
        }
        return;
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
    getAMonthsPayouts,
    sendAMonthsPayouts,
};