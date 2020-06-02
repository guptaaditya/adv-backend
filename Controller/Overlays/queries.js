function getOverlay(overlayModel) {
    const {
        id, overlayType, category, template, name, shouldShowOnPageLoad, showDelay, 
        shouldFadePageBackground, positionedBottom, closeButton, logo, background, message,
        input, button, createdOn, socialIcons, title, image
    } = overlayModel;
    return {
        id, overlayType, category, template, name, shouldShowOnPageLoad, showDelay, 
        shouldFadePageBackground, positionedBottom, 
        closeButton, 
        logo, 
        background, 
        message, 
        title, 
        image,
        input, 
        button, 
        createdOn,
        socialIcons
    }
}

module.exports = {
    getOverlay,
};