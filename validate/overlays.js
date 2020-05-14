const { validate } = require('./utils');

function createOverlay(req, res, next) {
    const permittedParams = ['overlayType', 'category', 'template', 'name'];
    const mandatoryParams = permittedParams;
    if (validate(permittedParams, req, res, mandatoryParams)) {
        next();
    }
}

function updateOverlay(req, res, next) {
    const permittedParams = [
        'name', 'shouldShowOnPageLoad', 'showDelay', 'shouldFadePageBackground', 
        'positionedBottom', 'closeButton', 'logo', 'background', 'message', 'input', 
        'button', 'socialIcons'
    ];
    const mandatoryParams = ['name'];
    if (validate(permittedParams, req, res, mandatoryParams)) {
        req.parsedParams.updatedOn = new Date();
        next();
    }
}

module.exports = {
    createOverlay,
    updateOverlay,
}