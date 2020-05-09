var express = require('express');
var router = express.Router();
const controller = require('../Controller/Admin');
const authController = require('../Controller/Auth/');
const validators = require('../validate/admin');

router.route('/payouts')
    .get(authController.preAuthorization, validators.verifyAdmin, controller.getAMonthsPayouts);

module.exports = router;
