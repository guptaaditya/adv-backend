const _ = require('lodash');
const { getFeatureFlagsPerSelection } = require('./utils');
const background = {};
const logo = {
    url: 'http://utv.com',
};
const message = {
    color: '',
    text: 'Set up your own overlay today',
};
const input = {
    placeholder: 'Please enter your email',
    color: '#ffffff'
};
const button = {
    color: '',
    textColor: '',
    name: 'Yes, Get Tips!'
};
const socialIcons = {
    facebook: '',
    twitter: ''
};
const closeButton = {
    isVisible: true,
    color: '#fff',
};

function getFeatureFlags(overlay) {
    return {
        shouldShowOnPageLoad: overlay.shouldShowOnPageLoad || true,
        showDelay: overlay.showDelay || 0,
        shouldFadePageBackground: overlay.shouldFadePageBackground || false,
        positionedBottom: overlay.positionedBottom || true,
        closeButton: overlay.closeButton || {
            ...closeButton,
        },
        background: overlay.background || {
            ...background,
        },
        logo: overlay.logo || {
            ...logo,
        },
        message: overlay.message || {
            ...message,
        },
        input: overlay.input || {
            ...input,
        },
        button: overlay.button || {
            ...button,
        },
        socialIcons: overlay.socialIcons || {
            ...socialIcons,
        },
        ...getFeatureFlagsPerSelection(overlay),
    };
};

module.exports = {
    getFeatureFlags,
};