var express = require('express');
var router = express.Router();
const controller = require('../Controller/Overlays');
const authController = require('../Controller/Auth/');
const validators = require('../validate/overlays');

router.route('/')
    .get(authController.preAuthorization, controller.getAllOverlays)
    .post(authController.preAuthorization, validators.createOverlay, controller.createOverlay);

router.route('/:overlayId')
    .get(authController.preAuthorization, controller.getOverlay)
    .delete(authController.preAuthorization, controller.deleteOverlay)
    .put(authController.preAuthorization, validators.updateOverlay, controller.updateOverlay);

router.route('/preview/:overlayId')
    .get(controller.previewOverlay);

module.exports = router;
