const { validate } = require('./utils');

function createLink(req, res, next) {
    const permittedParams = ['targetUrl', 'overlayId'];
    const mandatoryParams = ['targetUrl'];
    if (validate(permittedParams, req, res, mandatoryParams)) {
        next();
    }
}

function updateLink(req, res, next) {
    const permittedParams = ['targetUrl', 'overlayId'];
    const mandatoryParams = ['targetUrl'];
    if (validate(permittedParams, req, res, mandatoryParams)) {
        next();
    }
}

module.exports = {
    createLink,
    updateLink,
}