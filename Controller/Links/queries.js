function getLink(linkModel) {
    return {
        id: linkModel.id,
        shortUrl: linkModel.shortUrl,
        createdOn: linkModel.createdOn,
        overlayId: linkModel.overlayId,
        targetUrl: linkModel.targetUrl,
        visits: linkModel.visits,
    }
}

module.exports = {
    getLink,
};