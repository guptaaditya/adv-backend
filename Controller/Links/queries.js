function getLink(linkModel) {
    const { overlay } = linkModel;
    return {
        id: linkModel.id,
        shortUrl: linkModel.shortUrl,
        createdOn: linkModel.createdOn,
        overlayId: overlay && overlay._id ? overlay._id.toJSON(): '',
        overlayName: overlay && overlay.name ? overlay.name : '',
        targetUrl: linkModel.targetUrl,
        visits: linkModel.visits,
    }
}

module.exports = {
    getLink,
};