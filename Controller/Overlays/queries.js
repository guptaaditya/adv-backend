function getOverlay(overlayModel) {
    const {
        id, overlayType, category, template, name, shouldShowOnPageLoad, showDelay, 
        shouldFadePageBackground, positionedBottom, closeButton, logo, background, message,
        input, button, createdOn, socialIcons
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
        createdOn,
        socialIcons
    }
}

module.exports = {
    getOverlay,
};