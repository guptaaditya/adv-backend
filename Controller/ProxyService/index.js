const fs = require('fs'); 
const _ = require('lodash');
const request = require('request');
const queries = require('./queries');
const { Overlays: Overlay } = require('../../db');
const { incrementLinkVisits } = require('../Links');

async function getLinkPage(req, res, next) {
    const { linkId, shortUrl, targetUrl, overlayId } = req.parsedParams;
    try {
        // Read HTML File and replace its target url identifier, and send it
        let htmlData = fs.readFileSync('./public/helperIndexHtml.html',  {encoding:'utf8', flag:'r'}); 
        htmlData = _.replace(htmlData, /{TARGET_URL}/g, targetUrl);
        const { outerHtml = '', shouldShowOnPageLoad = true, showDelay = 0 } = await getOverlayHTMLbyId(overlayId);
        htmlData = _.replace(htmlData, /{OVERLAY_HTML}/g, outerHtml);
        htmlData = _.replace(htmlData, /{SHOW_DELAY}/g, showDelay);
        //update visits:-
        const isUpdated = await incrementLinkVisits(linkId);
        if (!isUpdated) {
            console.log(`Unexpected event. Could not update the link visit: ${linkId} - ${shortUrl}`)
        }
        return res.status(200).send(htmlData);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function getLongLinkHtml(req, res, next) {
    const { targetUrl } = req.parsedParams;
    req.pipe(request(targetUrl)).pipe(res);
}

async function getOverlayHTMLbyId(overlayId) {
    if (!overlayId) return null;
    const overlay = await Overlay.findOne({ _id: overlayId, isDeleted: false });
    if (overlay) {
        return queries.getOverlayHtml(overlay);
    }
    return null;
}

async function getOverlay(req, res, next) {
    const { overlayId } = req.params;
    try {
        const { outerHtml } = await getOverlayHTMLbyId(overlayId);
        if (outerHtml) {
            return res.status(200).send(outerHtml);
        }
        return res.status(400).json({ message: 'Bad request. Overlay not available' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    } 

}

module.exports = {
    getLinkPage,
    getLongLinkHtml,
    getOverlay,
}