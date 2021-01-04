module.exports = function (app) {

    const shop = require('../controllers/shop.controller');

    app.get('/shopify', shop.install);

    app.get('/shopify/callback', shop.callback);

    app.get('/api/orders', shop.order);
}