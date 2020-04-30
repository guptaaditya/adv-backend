const _ = require('lodash');
const queries = require('./queries');
const { Overlays: Overlay } = require('../../db');
const constants = require('../../constants');

async function createOverlay(req, res, next) {
    const { username } = req.user;
    try {
        const createdOverlay = await Overlay.create({
            ...req.parsedParams,
            createdBy: username,
        });
        if (createdOverlay.id) {
            return res.status(200).json(queries.getOverlay(createdOverlay));
        }
        console.error(req.parsedParams, username, 'createOverlay');
        return res.status(500).json({ message: 'Failed to create overlay' });
    } catch (e) {
        console.error(req.parsedParams, username, e, 'createOverlay');
        if (e.status && e.message) {
            return res.status(e.status).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function updateOverlay(req, res, next) {
    const { username } = req.user;
    const { overlayId } = req.params;
    try {
        const updatedOverlay = await Overlay.findOneAndUpdate(
            { _id: overlayId, createdBy: username, isDeleted: false },
            {
                ...req.parsedParams,
            },
            { new: true }
        );
        if (updatedOverlay) {
            return res.status(200).json(queries.getOverlay(updatedOverlay));
        }
        console.error(req.parsedParams, username, overlayId, 'updateOverlay');
        return res.status(500).json({ message: 'Failed to update overlay' });
    } catch (e) {
        console.error(req.parsedParams, username, overlayId, e, 'updateOverlay');
        if (e.status && e.message) {
            return res.status(e.status).json({ message: e.message });
        }
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function getOverlay(req, res, next) {
    const { username } = req.user;
    const { overlayId } = req.params;
    try {
        const overlay = await Overlay.findOne({ _id: overlayId, createdBy: username, isDeleted: false });
        if (overlay) {
            return res.status(200).json(queries.getOverlay(overlay));
        }
        return res.status(400).json({ message: 'Bad request. Overlay not available' });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error' });
    } 
}

async function getAllOverlays(req, res, next) {
    const { username } = req.user;
    try {
        const overlays = await Overlay.find({ createdBy: username, isDeleted: false });
        const responseOverlays = _.map(overlays, queries.getOverlay);
        return res.status(200).json(responseOverlays);
    } catch (e) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

async function deleteOverlay(req, res, next) {
    const { overlayId } = req.params;
    const { username } = req.user;
    try {
        const overlay = await Overlay.findOneAndUpdate(
            { _id: overlayId, createdBy: username, isDeleted: false },
            { isDeleted: true }
        );
        if (overlay) {
            return res.status(200).json({ message: 'Overlay deleted' });
        }
        return res.status(400).json({ message: 'Invalid Overlay Id' });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    createOverlay,
    updateOverlay,
    getAllOverlays,
    getOverlay,
    deleteOverlay,
}