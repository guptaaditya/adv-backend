const { hashPass, hashVerify } = require('../../helper');

function Users(mongoose) {
    const UsersSchema = new mongoose.Schema({
        username: String,
        name: String,
        password: String,
        role: { type: String, default: 'Operator' },
        timezone: { type: String, default: 'America/New_York' },
        registeredOn: { type: Date, default: Date.now },
        isDeleted: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        referredBy: { type: String },
        membership: {
            type: {
                planName: String,
                linksLimit: Number,
                overlaysLimit: Number,
                shareLinkLimit: Number,
                membershipType: String,
                validTill: Date,
                upgradePrice: Number,
                upgradeCurrency: String,
                upgradeCurrencySymbol: String,
            },
            default: {
                planName: 'Free - Basic Usage - Limited',
                linksLimit: 10,
                overlaysLimit: 0,
                shareLinkLimit: 100,
                membershipType: 'basic',
                upgradePrice: 25,
                upgradeCurrency: 'USD',
                upgradeCurrencySymbol: '$',
            },
        },
    });
    attachHooks(UsersSchema);
    return mongoose.model('Users', UsersSchema, 'users');
}

function attachHooks(schema) {
    schema.pre('save', async function (next) {
        var user = this;
        if (!user.isModified('password')) {
            return next()
        };
        const hashedPassword = await hashPass(user.password);
        user.password = hashedPassword;
        next();
    }, function (err) {
        next(err);
    });

    schema.methods.comparePassword = function(userProvidedPassword) {
        return hashVerify(userProvidedPassword, this.password)
    }
}

module.exports = Users;