const _ = require('lodash');

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
        let L1ReferrersReferrer = _.find(user.referralHierarchy, { username: L1Referrer }).referredBy;
        if (L1ReferrersReferrer) {
            const referrersReferrerInPayout = _.find(payouts, { username: L1ReferrersReferrer });
            if (!referrersReferrerInPayout) {
                payouts.push({ username : L1ReferrersReferrer, affiliate1: 0, affiliate2: 1 });
            } else {
                ++referrersReferrerInPayout.affiliate2;
            }
        }
    });
    return payouts;
}

module.exports = {
    getPayoutsMap,
};