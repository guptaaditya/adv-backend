const { hashPass, hashVerify } = require('../../helper');

function VerificationCodes(mongoose) {
    const VerificationCodesSchema = new mongoose.Schema({
        code: String,
        username: String,
        createdOn: { type: Date, default: Date.now },
        isUsed: { type: Boolean, default: false },
    });
    attachHooks(VerificationCodesSchema);
    return mongoose.model('VerificationCodes', VerificationCodesSchema, 'vcodes');
}

function attachHooks(schema) {
    schema.pre('save', async function (next) {
        var verificationCode = this;
        if (!verificationCode.isModified('code')) {
            return next()
        };
        const hashedCode = await hashPass(verificationCode.code);
        verificationCode.code = hashedCode;
        next();
    }, function (err) {
        next(err);
    });

    schema.methods.compareCode = function(userProvidedCode) {
        return hashVerify(userProvidedCode, this.code);
    }
}

module.exports = VerificationCodes;