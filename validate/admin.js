const constants = require('../constants');

function verifyAdmin(req, res, next) {
    const { role } = req.user;
    if (role !== constants.ADMIN_TYPE) {
        res.send(500).json({ message: 'Beware you are being monitored' });
    }
    next();
}

module.exports = {
    verifyAdmin,
}