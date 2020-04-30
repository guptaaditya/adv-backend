const fs = require('fs'); 
const _ = require('lodash');
const request = require('request');
const queries = require('./queries');
const { Overlays: Overlay } = require('../../db');

async function getLinkPage(req, res, next) {
    const { linkId, shortUrl, targetUrl, overlayId } = req.parsedParams;
    try {
        // Read HTML File and replace its target url identifier, and send it
        let htmlData = fs.readFileSync('./public/helperIndexHtml.html',  {encoding:'utf8', flag:'r'}); 
        htmlData = _.replace(htmlData, /{TARGET_URL}/g, targetUrl);
        htmlData = _.replace(htmlData, /{OVERLAY_ID}/g, overlayId);
        return res.status(200).send(htmlData);
    } catch (e) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function getLongLinkHtml(req, res, next) {
    const { targetUrl } = req.parsedParams;
    req.pipe(request(targetUrl)).pipe(res);
}

async function getOverlay(req, res, next) {
    const { overlayId } = req.params;
    try {
        const overlay = await Overlay.findOne({ _id: overlayId, isDeleted: false });
        if (overlay) {
            // create overlay HTML and respond with it
            const overlayHTML = queries.getOverlayHtml(overlay);
            return res.status(200).send(overlayHTML);
        }
        return res.status(400).json({ message: 'Bad request. Overlay not available' });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error' });
    } 

}

module.exports = {
    getLinkPage,
    getLongLinkHtml,
    getOverlay,
}