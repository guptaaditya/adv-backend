const _ = require('lodash');
const constants = require('./constants');

function getFeatureFlagsPerSelection(selected) {
    const { overlayType, category, template, name } = selected;
    const features = {
        widthClassName: overlayType, //provided by classname corresponding to overlay-type,
        fontSizeClassName: category, //font-size depends upon the category of overlay selected,
        templateClassName: `template-${template}`,
        overlayName: name,
    }
/*     
    showLogo: false, //if true then prompt for logo properties in form,
    showMessage: false, //show default message initially
    showInput: false, //show default button placeholder initially
    showButton: false, //show default button text initially
    showSocialIcons: false, //if false then skip, if true, then let use opt which icons they want
 */
    const defaultFeatureFlags = _.get(constants.featureFlags, [overlayType, category, template], null);
    if(!defaultFeatureFlags) {
        throw Error({
            message: 'Some error in flow/development. selected object not as expected', 
            selected
        });
    }
    return _.defaults(features, defaultFeatureFlags);
}

module.exports = {
    getFeatureFlagsPerSelection,
}