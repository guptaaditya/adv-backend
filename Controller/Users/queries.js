function getUser(userModel) {
    return {
        username: userModel.username,
        name: userModel.name,
        membership: getMembership(userModel.membership),
        timezone: userModel.timezone,
    }
}

function getMembership(membership) {
    return {
        planName: membership.planName,
        linksLimit: membership.linksLimit === -1 ? 'Unlimited' : membership.linksLimit,
        overlaysLimit: membership.overlaysLimit === -1 ? 'Unlimited' : membership.overlaysLimit,
        shareLinkLimit: membership.shareLinkLimit === -1 ? 'Unlimited' : membership.shareLinkLimit,
        type: membership.membershipType,
        upgradePrice: membership.upgradePrice,
        upgradeCurrency: membership.upgradeCurrency,
        upgradeCurrencySymbol: membership.upgradeCurrencySymbol
    };
}

module.exports = {
    getUser,
    getMembership,
};