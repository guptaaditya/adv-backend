var routerV1 = require('./v1');
const cors = require('cors');

function initializeRouting(app) {
  app.options('*', cors());
  app.post('*', cors());
  app.put('*', cors());
  app.get('*', cors());
  app.delete('*', cors());
  app.use('/v1', routerV1);
}

module.exports = initializeRouting;
