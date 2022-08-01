const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/get_jimdb_key',
    createProxyMiddleware({
    target: 'https://cds.3.cn',
      changeOrigin: true,
    })
  );
};