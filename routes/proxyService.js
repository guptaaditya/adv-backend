const express = require('express');
const router = express.Router();
const proxyRouter = express.Router();
const controller = require('../Controller/ProxyService');
const validators = require('../validate/proxyService');

router.route('/')
    .get(validators.isValidLink, controller.getLinkPage);

proxyRouter.route('/')
    .get(validators.isValidTargetUrl, controller.getLongLinkHtml);

proxyRouter.route('/overlay/:overlayId')
    .get(controller.getOverlay);

module.exports = {
    router,
    proxyRouter,
}
