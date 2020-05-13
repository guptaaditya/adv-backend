function uploadFile(req, res, next) {
    if(req.file) {
        const fileName = req.file.filename;
        res.status(200).send(`${process.env.IMAGE_UPLOADS}${fileName}`);
        return;
    }
    res.status(500).send({ message: 'The file could not be saved' });
}

module.exports = {
    uploadFile,
};