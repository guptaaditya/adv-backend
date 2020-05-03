function getLink(linkModel) {
    return {
        id: linkModel.id,
        shortUrl: linkModel.shortUrl,
        createdOn: linkModel.createdOn,
        overlayId: linkModel.overlay._id.toJSON(),
        targetUrl: linkModel.targetUrl,
        visits: linkModel.visits,
    }
}

module.exports = {
    getLink,
};