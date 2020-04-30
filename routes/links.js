var express = require('express');
var router = express.Router();
const controller = require('../Controller/Links');
const authController = require('../Controller/Auth/');
const validators = require('../validate/links');

router.route('/')
    .get(authController.preAuthorization, controller.getAllLinks)
    .post(authController.preAuthorization, validators.createLink, controller.createLink);

router.route('/:linkId')
    .get(authController.preAuthorization, controller.getLink)
    .delete(authController.preAuthorization, controller.deleteLink)
    .put(authController.preAuthorization, validators.updateLink, controller.updateLink);

module.exports = router;
