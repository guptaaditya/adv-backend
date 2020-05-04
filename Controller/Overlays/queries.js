function getOverlay(overlayModel) {
    const {
        id, overlayType, category, template, name, shouldShowOnPageLoad, showDelay, 
        shouldFadePageBackground, positionedBottom, closeButton, logo, background, message,
        input, button, createdOn
    } = overlayModel;
    return {
        id, overlayType, category, template, name, shouldShowOnPageLoad, showDelay, 
        shouldFadePageBackground, positionedBottom, 
        closeButton, 
        logo, 
        background, 
        message, 
        input, 
        button, 
        createdOn
    }
}

module.exports = {
    getOverlay,
};