var express = require('express');
var router = express.Router();
const controller = require('../Controller/Users');
const authController = require('../Controller/Auth/');
const validators = require('../validate/users');

router.route('/')
    .get(authController.preAuthorization, controller.getUser)
    .post(validators.createUser, controller.createUser)
    .put(authController.preAuthorization, validators.updateUser, controller.updateUser);

router.post(
    '/login', 
    authController.preAuthentication, 
    authController.getUserLogIn
);

router.post(
    '/verify', 
    validators.verifyVerificationCode, 
    authController.getResetPassToken
);

router.get(
    '/verify/:verificationToken', 
    validators.verifyEmail, 
    controller.verifyUserEmail
);

router.get(
    '/:username/verification', 
    validators.getUserVerificationCode, 
    authController.getUserVerficiationCode
);

module.exports = router;
