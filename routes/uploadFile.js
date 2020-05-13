var express = require('express');
const multer  = require('multer');
var router = express.Router();
const upload = multer({ dest: 'uploads/' });
const controller = require('../Controller/Upload');
const authController = require('../Controller/Auth/');

router.route('/')
    .post(authController.preAuthorization, upload.single('file'), controller.uploadFile);

module.exports = router;
