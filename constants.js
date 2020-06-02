module.exports = {
    EXPIRY_VERIFICATION_CODE_MINUTES: 5,
    EXPIRY_RESET_TOKEN_MINUTES: 5,
    EXPIRY_LOGIN_SHORT_TERM_TOKEN: '24h',
    EXPIRY_LOGIN_LONG_TERM_TOKEN: '1000d',
    EXPIRY_VERIFY_EMAIL: '5d',
    VERIFY_EMAIL_KEY: 'YourIDCode',
    ADMIN_TYPE: 'Powerful-Superuser',
    SIGNUP_ROUTE: 'signup/',
    PAID_MEMBERSHIP: {
        planName: 'Creator account',
        linksLimit: -1,
        overlaysLimit: -1,
        shareLinkLimit: -1,
        membershipType: 'premium',
        validTill: null,
    },
    FREE_MEMBERSHIP: {
        planName: 'Sharer account',
        linksLimit: 10,
        overlaysLimit: 0,
        shareLinkLimit: 100,
        membershipType: 'basic',
        upgradePrice: 25,
        upgradeCurrency: 'USD',
        upgradeCurrencySymbol: '$',
    }
}