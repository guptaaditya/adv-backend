
const _ = require('lodash');
const { Overlays: Overlay, Links: Link } = require('../../db');
const queries = require('./queries');

async function getGeneralUsage(req, res, next) {
    const { username } = req.user;
    
    try {
        const totalOverlays = await Overlay.count({ 
            createdBy: username
        });
        const totalLinks = await Link.count({ 
            createdBy: username
        });
        const totalVisits = await Link.aggregate([
            { $match: { createdBy: username } },
            { $group: { _id: null, visits: { $sum: "$visits" } } }
        ]);
        const stats = [
            { "name": "Site Visits", "value": totalVisits[0].visits },
            { "name": "Overlays", "value": totalOverlays },
            { "name": "Links", "value": totalLinks }
        ];

        const top5Links = await Link.find({ 
            createdBy: username, 
            isDeleted: false 
        }).populate('overlay').sort({ 'visits': 'desc' }).limit(5);

        return res.status(200).json({
            stats,
            top5Links: queries.getTop5Links(top5Links),
            top5Overlays: queries.getTop5OverlaysFromLinks(top5Links),
        });
    } catch (e) {
        return res.status(500).json({ message: 'Server Error' });
    } 
}

module.exports = {
    getGeneralUsage,
}