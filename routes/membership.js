var express = require('express');
var router = express.Router();
const controller = require('../Controller/Membership');
const authController = require('../Controller/Auth/');
const validators = require('../validate/users');

router.route('/')
    .get(authController.preAuthorization, controller.getUserMembership)
    .post(controller.upgradeUserMembership);

module.exports = router;
