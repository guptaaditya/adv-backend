const constants = require('../../constants');

function getUser(userModel) {
    return {
        username: userModel.username,
        name: userModel.name,
        membership: getMembership(userModel.membership),
        timezone: userModel.timezone,
        isVerified: userModel.isVerified,
        usertype: userModel.role,
        referralLink: `${process.env.UI_DOMAIN}?referral=${btoa(userModel.username)}`,
    }
}

function getMembership(membership) {
    return {
        planName: membership.planName,
        linksLimit: membership.linksLimit === -1 ? 'Unlimited' : membership.linksLimit,
        overlaysLimit: membership.overlaysLimit === -1 ? 'Unlimited' : membership.overlaysLimit,
        shareLinkLimit: membership.shareLinkLimit === -1 ? 'Unlimited' : membership.shareLinkLimit,
        type: membership.membershipType,
        validTill: membership.validTill,
        upgradePrice: membership.upgradePrice,
        upgradeCurrency: membership.upgradeCurrency,
        upgradeCurrencySymbol: membership.upgradeCurrencySymbol
    };
}

module.exports = {
    getUser,
    getMembership,
};