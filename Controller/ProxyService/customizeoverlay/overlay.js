const _ = require('lodash');
function renderOverlay(featureFlags) {
    const {
        widthClassName = '',
        templateClassName = '',
        fontSizeClassName = '',
        shouldShowOnPageLoad,
        showDelay,
        shouldFadePageBackground,
        showLogo,
        showMessage,
        showInput,
        showButton,
        showSocialIcons,
        logo,
        message,
        input,
        button,
        socialIcons,
        background,
        positionedBottom,
        closeButton,
    } = featureFlags;

    const isSocialIconsVisible = showSocialIcons && Boolean(_.find(socialIcons, (url, key) => Boolean(url)));
    const socialIconsClass = `socialIcons ${isSocialIconsVisible ? '' : 'hidden'}`;

    const logoClass = `logo ${showLogo ? '': 'hidden'}`;
    const positionClass = positionedBottom ? 'position-bottom': 'position-top';

    const backgroundImage = background.image ? ` background-image: url(${background.image});` : '';
    
    const logoImage = logo.image 
        ? `<img src='${logo.image}' />`
        : `<div class='dummy-logo'>Logo</div>`;
        
    const messageHtml = showMessage 
        ? `<div class='message' style="color: ${message.color};">${message.text}</div>`
        : '';
        
    const inputHtml = showInput 
        ? `<div class='input'>
            <input style="background-color: ${input.color || ''} type='text' 
                placeholder="${input.placeholder}" />
           </div>`
        : '';
    const buttonHtml = showButton
        ? `<button style="background-color: ${button.color}; color: ${button.textColor};">
            ${button.name}</button>`
        : '';

    const fbIcon = socialIcons.facebook
        ? `<a target='_blank' href='${socialIcons.facebook}'>
            <img src="http://localhost:3000/facebook.svg" />
           </a>`
        : '';

    const twitterIcon = socialIcons.twitter
        ? `<a target='_blank' href='${socialIcons.twitter}'>
            <img src="http://localhost:3000/twitter.svg" />
           </a>`
        : '';

    const closeButtonHtml = closeButton.isVisible 
        ? `<div onclick="onClosehandler()" class='close-button' style="color: ${closeButton.color};">x</div>` 
        : '';
    
    const innerOverlayHtml = `
        <div 
            class='${widthClassName} ${fontSizeClassName} ${templateClassName} ${positionClass}'
            style='background-color: ${background.color};${backgroundImage}'
        >
            <div class='${logoClass}'>
                <a target='_blank' href='${logo.url || '#'}'>
                    ${logoImage}
                </a>
            </div>
            ${messageHtml}
            <div class='flexible'>
                ${inputHtml}
                ${buttonHtml}
            </div>
            <div class='${socialIconsClass}'>
                ${fbIcon}
                ${twitterIcon}
            </div>
            ${closeButtonHtml}
        </div>
        <script type="text/javascript">
            function onClosehandler() {
                const overlayNode = document.getElementById('overlay');
                const fadeBg = document.querySelector('.fade-background');
                overlayNode.parentNode.removeChild(overlayNode);
                if (fadeBg) {
                    fadeBg.parentNode.removeChild(fadeBg);
                }
            }
        </script>
    `;

    let outerHtml = `<div id='overlay' class='force-hide'>${innerOverlayHtml}</div>`

    if (shouldFadePageBackground) {
        outerHtml = `<div class='fade-background'></div>${outerHtml}`
    }
    return {
        outerHtml,
        ...featureFlags,
    };
}

module.exports = {
    renderOverlay,
}