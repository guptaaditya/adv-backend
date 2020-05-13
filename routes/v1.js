const express = require('express');
const routerV1 = express.Router();
const usersRouter = require('./users');
const linksRouter = require('./links');
const overlaysRouter = require('./overlays');
const membershipRouter = require('./membership');
const adminRouter = require('./admin');
const usageRouter = require('./usage');
const uploadFileRouter = require('./uploadFile');
const { router: defaultProxyRouter, proxyRouter } = require('./proxyService');

routerV1.use('/user', usersRouter);
routerV1.use('/usage', usageRouter);
routerV1.use('/link', linksRouter);
routerV1.use('/membership', membershipRouter);
routerV1.use('/overlay', overlaysRouter);
routerV1.use('/admin', adminRouter);
routerV1.use('/proxy', proxyRouter);
routerV1.use('/upload', uploadFileRouter);
routerV1.use('/:shortLinkHash', defaultProxyRouter);

module.exports = routerV1;
