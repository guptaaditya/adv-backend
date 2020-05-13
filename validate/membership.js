const { validate } = require('./utils');

function upgradeMembership(req, res, next) {
    // validate if the call is from localhost or from paypal domain only.
    // validate the event is payment complete only
    // validate the paypal signature by calling back the paypal API.
    debugger;
    console.log(req);
    next();
}

module.exports = {
    upgradeMembership,
}