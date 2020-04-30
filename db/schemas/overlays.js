function Overlays(mongoose) {
    const OverlaysSchema = new mongoose.Schema({
        overlayType: { type: String, required: true },
        category: { type: String, required: true },
        template: { type: String, required: true },
        name: { type: String, required: true },
        shouldShowOnPageLoad: { type: Boolean, default: true },
        showDelay: { type: Number, default: 0 },
        shouldFadePageBackground: { type: Boolean, default: false },
        positionedBottom: { type: Boolean, default: true },
        closeButton: {
            type: {
                isVisible: { type: Boolean, default: true },
                color: { type: String, default: '#fff' },
            }, 
            default: {
                isVisible: true,
                color: '#fff',
            }
        },
        logo: {
            type: {
                url: { type: String, default: '' },
                image: { type: String, default: '' },
            }, 
            default: {
                url: '',
                image: '',
            }
        },
        background: {
            type: {
                color: { type: String, default: '' },
                image: { type: String, default: '' },
            }, 
            default: {
                color: '',
                image: '',
            }
        },
        message: {
            type: {
                color: { type: String, default: '' },
                text: { type: String, default: '' },
            }, 
            default: {
                color: '',
                text: 'Set up your own overlay today',
            }
        },
        input: {
            type: {
                color: { type: String, default: '' },
                placeholder: { type: String, default: '' },
            }, 
            default: {
                color: '#ffffff',
                placeholder: 'Please enter your email',
            }
        },
        button: {
            type: {
                color: { type: String, default: '' },
                textColor: { type: String, default: '' },
                name: { type: String, default: '' },
            }, 
            default: {
                textColor: '',
                color: '#ffffff',
                name: 'Yes, Get Tips!',
            }
        },
        createdBy: { type: String, required: true },
        createdOn: { type: Date, default: Date.now },
        updatedOn: { type: Date, default: Date.now },
        visits: { type: Number, default: 0 },
        lastVisit: { type: Date },
        isDeleted: { type: Boolean, default: false },
      });
    return mongoose.model('Overlays', OverlaysSchema, 'overlays');
}

module.exports = Overlays;