const _ = require('lodash');
const queries = require('./queries');
const { Links: Link } = require('../../db');
const constants = require('../../constants');

async function createLink(req, res, next) {
    const { targetUrl, overlayId } = req.parsedParams; 
    const { username } = req.user;
    try {
        const createdLink = await Link.create({
            targetUrl,
            createdBy: username,
            overlay: overlayId,
        });
        if (createdLink.id) {
            const shortLinkHash = btoa(createdLink.id);
            const updatedLink = await Link.findByIdAndUpdate(createdLink.id,
                { shortUrl: constants.SHORT_LINK_DOMAIN+shortLinkHash },
                { new: true }
            );
            if (updatedLink) {
                return res.status(200).json(queries.getLink(updatedLink));
            }
            return res.status(500).json({ message: 'Failed to update short link' });
        }
        return res.status(500).json({ message: 'Transaction recording failed' });
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
        const links = await Link.find({ createdBy: username, isDeleted: false });
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

module.exports = {
    createLink,
    updateLink,
    getAllLinks,
    getLink,
    deleteLink,
}