const featureFlags = {
    bar: {
        calltoaction: {
            1: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: false,
                showButton: false,
                showSocialIcons: true,
            },
            2: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: false,
                showButton: false,
                showSocialIcons: false,
            },
            3: {
                showLogo: false,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: false,
                showButton: false,
                showSocialIcons: false,
            }
        },
        optin: {
            1: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: true,
                showButton: true,
                showSocialIcons: true,
            },
            2: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: true,
                showButton: true,
                showSocialIcons: false,
            },
            3: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: true,
                showButton: true,
                showSocialIcons: false,
            }
        }
    },
    notification: {
        calltoaction: {
            1: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: false,
                showButton: false,
                showSocialIcons: false,
            },
            2: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: true,
                showInput: false,
                showButton: true,
                showSocialIcons: false,
            }
        },
        optin: {
            1: {
                showLogo: true,
                showImage: false,
                showTitle: false,
                showMessage: false,
                showInput: true,
                showButton: true,
                showSocialIcons: false,
            }
        }
    },
    popup: {
        calltoaction: {
            1: {
                showLogo: false,
                showImage: true,
                showTitle: true,
                showMessage: true,
                showInput: false,
                showButton: true,
                showSocialIcons: false,
            }
        }
    }
};

module.exports = {
    featureFlags,
}