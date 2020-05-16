const _ = require('lodash');
const queries = require('./queries');
const { Links: Link } = require('../../db');
const { getRandomLinkHash, getProxyServiceDomain } = require('../../helper');
const { isUrlAThreat } = require('../Google/safe-browsing');

async function createLink(req, res, next) {
    const { targetUrl, overlayId } = req.parsedParams; 
    const { username } = req.user;
    try {
        const isMalicious = await isUrlAThreat(targetUrl);
        if(isMalicious) {
            return res.status(403).json({ displayMessage: 'This URL is malicious and thus blocked by utv.surf' });
        }
        const createdLink = await Link.create({
            targetUrl,
            createdBy: username,
            overlay: overlayId,
            shortUrl: getProxyServiceDomain()+getRandomLinkHash(),
        });
        if (createdLink.id) {
            return res.status(200).json(queries.getLink(createdLink));
        }
    } catch (e) {
        console.error(e);
        if (e.status && e.message) {
            return res.status(e.status).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function updateLink(req, res, next) {
    const { targetUrl, overlayId } = req.parsedParams; 
    const { username } = req.user;
    const { linkId } = req.params;
    try {
        const isMalicious = await isUrlAThreat(targetUrl);
        if(isMalicious) {
            return res.status(403).json({ displayMessage: 'This URL is malicious and thus blocked by utv.surf' });
        }

        const updateLink = await Link.findOneAndUpdate(
            { _id: linkId, createdBy: username, isDeleted: false },
            { targetUrl, overlay: overlayId },
            { new: true }
        );
        if (updateLink) {
            return res.status(200).json(queries.getLink(updateLink));
        }
        return res.status(400).json({ message: 'Bad request. Link not available' });
    } catch (e) {
        console.error(e);
        if (e.status && e.message) {
            return res.status(e.status).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    } 
}

async function getLink(req, res, next) {
    const { username } = req.user;
    const { linkId } = req.params;
    try {
        const link = await Link.findOne({ _id: linkId, createdBy: username, isDeleted: false });
        if (link) {
            return res.status(200).json(queries.getLink(link));
        }
        return res.status(400).json({ message: 'Bad request. Link not available' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    } 
}

async function getAllLinks(req, res, next) {
    const { username } = req.user;
    try {
        const links = await Link.find({ createdBy: username, isDeleted: false }).populate('overlay');
        const responseLinks = _.map(links, queries.getLink);
        return res.status(200).json(responseLinks);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function deleteLink(req, res, next) {
    const { linkId } = req.params;
    const { username } = req.user;
    try {
        const link = await Link.findOneAndUpdate(
            { _id: linkId, createdBy: username, isDeleted: false },
            { isDeleted: true }
        );
        if (link) {
            return res.status(200).json({ message: 'Link deleted' });
        }
        return res.status(400).json({ message: 'Invalid Link Id' });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function incrementLinkVisits(linkId) {
    try {
        if (!linkId) throw { message: 'No Link ID found. LinkId is a mandatory parameter' };
        const res = await Link.updateOne(
            { _id: linkId, isDeleted: false }, 
            { 
                $inc: { visits: 1 }, 
                $set: { lastVisit: Date.now() } 
            }
        );
        if (res.nModified === 1) {
            if (res.n > 1) {
                console.log(`Unexpected event: Linkid visit updated ${linkId} 
                but found more than one document matching`);
            }
            return true;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = {
    createLink,
    updateLink,
    getAllLinks,
    getLink,
    deleteLink,
    incrementLinkVisits,
}