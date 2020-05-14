const { validate } = require('./utils');

function upgradeMembership(req, res, next) {
    // validate if the call is from localhost or from paypal domain only.
    // validate the paypal signature by calling back the paypal API.
    // validate the event is payment complete only
    const eventName = req.body.event_type;
    if(eventName !== "PAYMENT.SALE.COMPLETED") {
        res.send(400).json({ message: 'Send Payment sale completion notification' });
    }
    console.log('PAYMENT NOTIFICATION', req);
    next();
}

function saveOrderDetails(req, res, next) {
    const permittedParams = ['order'];
    const mandatoryParams = ['order'];
    if (validate(permittedParams, req, res, mandatoryParams)) {
        next();
    }
}

module.exports = {
    upgradeMembership,
    saveOrderDetails,
}