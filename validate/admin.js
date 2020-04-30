const constants = require('../constants');

function verifyAdmin(req, res, next) {
    const { usertype } = req.user;
    if (usertype !== constants.ADMIN_TYPE) {
        res.send(500).json({ message: 'Beware you are being monitored' });
    }
    next();
}

module.exports = {
    verifyAdmin,
}