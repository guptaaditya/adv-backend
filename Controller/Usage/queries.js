const _ = require('lodash');
const linkQueries = require('../Links/queries');
const overlayQueries = require('../Overlays/queries');

function getTop5Links(links) {
    return _.map(links, linkQueries.getLink);
}

function getTop5OverlaysFromLinks(links) {
    return _.map(links, ({ overlay }) => {
        if(!overlay) return null;
        return overlayQueries.getOverlay(overlay);
    });
}

module.exports = {
    getTop5Links,
    getTop5OverlaysFromLinks,
}