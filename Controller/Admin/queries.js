const _ = require('lodash');
const MEMERSHIP_COST = 25;
const PERCENT_L1 = 30;
const PERCENT_L2 = 10;

function getPayoutItemsForPaypal(newUsersRegistered, currMonth = '') {
    return _.map(newUsersRegistered, ({ username, amount }) => ({
        note: `Enjoy your ${amount} payout from Usethe views. Keep up the good work!`,
        amount: {
            currency: "USD",
            value: amount,
        },
        receiver: username,
        sender_item_id: `payout_date_${currMonth}_${username}`,
    }));
}

function calculatePerResellerPayoutAmount(rowData) {
    const { affiliate1, affiliate2 } = rowData;
    const totalPayout = (affiliate1 * 0.01 * PERCENT_L1 * MEMERSHIP_COST) + (affiliate2 * 0.01 * PERCENT_L2 * MEMERSHIP_COST);
    const formattedPayout =  totalPayout.toFixed(2);
    rowData.amount = Number(formattedPayout);
}

function getPayoutsMap(newUsersRegistered = []) {
    const payouts = [];
    _.forEach(newUsersRegistered, user => {
        let L1Referrer = user.referredBy;
        const referrerInPayout = _.find(payouts, { username: L1Referrer });
        if (!referrerInPayout) {
            payouts.push({ username : L1Referrer, affiliate1: 1, affiliate2: 0 });
        } else {
            ++referrerInPayout.affiliate1;
        }
        let L1ReferrersReferrer = _.find(user.referralHierarchy, { username: L1Referrer });
        if (L1ReferrersReferrer && L1ReferrersReferrer.referredBy) {
            const referrersReferrerInPayout = _.find(payouts, { username: L1ReferrersReferrer.referredBy });
            if (!referrersReferrerInPayout) {
                payouts.push({ username : L1ReferrersReferrer.referredBy, affiliate1: 0, affiliate2: 1 });
            } else {
                ++referrersReferrerInPayout.affiliate2;
            }
        }
    });
    _.forEach(payouts, calculatePerResellerPayoutAmount);
    return payouts;
}

function getPayoutsObject(payoutItems, currMonth) {
    return  {
        sender_batch_header: {
          "recipient_type": "EMAIL",
          "email_message": "Payouts from usetheviews.com",
          "note": "Enjoy your Payout!!",
          "sender_batch_id": btoa(currMonth),
          "email_subject": "Here is your commission from usetheviews.com"
        },
        items: payoutItems,
    };
}

module.exports = {
    getPayoutsMap,
    getPayoutItemsForPaypal,
    getPayoutsObject,
};