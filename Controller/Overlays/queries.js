function getOverlay(overlayModel) {
    const {
        id, overlayType, category, template, name, shouldShowOnPageLoad, showDelay, 
        shouldFadePageBackground, positionedBottom, closeButton, logo, background, message,
        input, button, createdOn, visits, lastVisit
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
        createdOn, visits, lastVisit
    }
}

module.exports = {
    getOverlay,
};