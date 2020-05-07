const { getRequestUrl } = require('../helper');
const { Links: Link } = require('../db');

async function isValidLink(req, res, next) {
    try {
        const shortUrl = getRequestUrl(req);
        const link = await Link.findOne({ shortUrl }).exec();
        if (link.targetUrl) {
            //Visits validation #pending as per membership
            req.parsedParams = { 
                linkId: link.id,
                shortUrl,
                targetUrl: link.targetUrl, 
                overlayId: link.overlay && link.overlay._id ? link.overlay._id.toJSON(): '',
            };
            return next();
        }
        throw { status: 404, message: 'URL not found' };
    } catch (e) {
        console.error(e);
        if (!e.status || !e.message) {
            throw { status: 400, message: 'Invalid URL' };
            return ;
        }
        throw e;
    }
}

function isValidTargetUrl(req, res, next) {
    if(req.query.page) {
        req.parsedParams = {
            targetUrl: req.query.page,
        }
        next();
        return;
    }
    res.status(400).json({ message: 'Bad request' });
}

module.exports = {
    isValidLink,
    isValidTargetUrl,
}