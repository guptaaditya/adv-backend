const _ = require('lodash');
const linkQueries = require('../Links/queries');
const overlayQueries = require('../Overlays/queries');

function getTop5Links(links) {
    return _.map(links, linkQueries.getLink);
}

function getTop5Overlays(overlays) {
    return _.map(overlays, overlay => {
        const overlayModel = overlayQueries.getOverlay(overlay);
        overlayModel.visits = _.reduce(overlay.links, (totalVisits, link) => {
            return _.add(totalVisits, link.visits);
        }, 0);
        return overlayModel;
    });
}

module.exports = {
    getTop5Links,
    getTop5Overlays,
}