const _ = require('lodash');
const { getFeatureFlagsPerSelection } = require('./utils');
const background = {};
const logo = {
    url: `${process.env.UI_DOMAIN}/logo.svg`,
};
const message = {
    color: '',
    text: 'Set up your own overlay today',
};
const title = {
    color: '',
    text: 'Get more from information',
};
const image = {
    image: `${process.env.REACT_APP_API_HOSTNAME}/logo.svg`,
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
        shouldShowOnPageLoad: _.get(overlay, 'shouldShowOnPageLoad', true),
        showDelay: _.get(overlay, 'showDelay', 0),
        shouldFadePageBackground: _.get(overlay, 'shouldFadePageBackground', false),
        positionedBottom: _.get(overlay, 'positionedBottom', true),
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
        title: overlay.title || {
            ...title,
        },
        image: overlay.image || {
            ...image
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