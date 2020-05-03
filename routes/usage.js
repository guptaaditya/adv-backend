var express = require('express');
var router = express.Router();
const controller = require('../Controller/Usage');
const authController = require('../Controller/Auth/');

router.route('/')
    .get(
        authController.preAuthorization, 
        controller.getGeneralUsage,
    );

module.exports = router;
