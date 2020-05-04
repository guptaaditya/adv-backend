function Links(mongoose) {
    const LinksSchema = new mongoose.Schema({
        overlay: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Overlays'
        },
        targetUrl: { type: String, required: true },
        shortUrl: String,
        createdBy: { type: String, required: true },
        createdOn: { type: Date, default: Date.now },
        updatedOn: { type: Date, default: Date.now },
        visits: { type: Number, default: 0 },
        lastVisit: { type: Date },
        isDeleted: { type: Boolean, default: false },
    });
    attachHooks(LinksSchema)
    return mongoose.model('Links', LinksSchema, 'links');
}

async function overlayExists(overlayId) {
    const { Overlays: Overlay } = require('../');
    try {
        const overlayCount = await Overlay.count({ _id: overlayId }); 
        return Boolean(overlayCount > 0);
    } catch (e) {
        console.error(e);
        throw { status: 400, message: 'Invalid overlayId' };
    }
}

async function documentValidateOverlayId(next) {
    const link = this;
    if (!link.isModified('overlay') || !link.overlay) {
        return next()
    };
    const isOverlayIdValid = await overlayExists(link.overlay);
    if (!isOverlayIdValid) {
        throw { status: 400, message: `Overlay doesn't exist` };
    }
    next();
}

function attachHooks(schema) {
    schema.pre('save', documentValidateOverlayId);
    schema.pre('findOneAndUpdate', async function (next) {
        const { overlay = '' } = this.getUpdate();
        if (!overlay) {
            return next()
        };
        const isOverlayIdValid = await overlayExists(overlay);
        if (!isOverlayIdValid) {
            throw { status: 400, message: `Overlay doesn't exist` };
        }
        next();
    });
}

module.exports = Links;