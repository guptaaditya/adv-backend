const { getFeatureFlags } = require('./customizeoverlay/');
const { renderOverlay } = require('./customizeoverlay/overlay');

function getOverlayHtml(overlay) {
    const featureFlags = getFeatureFlags(overlay);
    const renderedOverlay = renderOverlay(featureFlags);
    return renderedOverlay;
}

module.exports = {
    getOverlayHtml,
}