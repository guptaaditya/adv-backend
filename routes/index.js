var usersRouter = require('./users');
var linksRouter = require('./links');
var overlaysRouter = require('./overlays');
var membershipRouter = require('./membership');
var adminRouter = require('./admin');
var { router: defaultProxyRouter, proxyRouter } = require('./proxyService');
const cors = require('cors');

function initializeRouting(app) {
  app.options('*', cors());
  app.post('*', cors());
  app.put('*', cors());
  app.get('*', cors());
  app.delete('*', cors());
  app.use('/user', usersRouter);
  app.use('/link', linksRouter);
  app.use('/membership', membershipRouter);
  app.use('/overlay', overlaysRouter);
  app.use('/admin', adminRouter);
  app.use('/proxy', proxyRouter);
  app.use('/:shortLinkHash', defaultProxyRouter);
}

module.exports = initializeRouting;
