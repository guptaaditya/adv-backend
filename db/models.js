const Users = require('./schemas/users');
const Links = require('./schemas/links');
const Overlays = require('./schemas/overlays');
const VerificationCodes = require('./schemas/verificationCodes');
const Payments = require('./schemas/payments');
const Orders = require('./schemas/orders');

function initializeAllModels(mongoose) {
    return {
        Users: Users(mongoose),
        Links: Links(mongoose),
        Overlays: Overlays(mongoose),
        VerificationCodes: VerificationCodes(mongoose),
        Payments: Payments(mongoose),
        Orders: Orders(mongoose),
    }
}

module.exports = initializeAllModels;