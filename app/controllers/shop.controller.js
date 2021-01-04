const nonce = require('nonce')();
const querystring = require('querystring');
const request = require('request-promise');
const apiKey = process.env.SHOPIFY_API_KEY;
const apiSecret = process.env.SHOPIFY_API_SECRET;
const scopes = 'read_orders,write_orders,read_products,write_products';
const forwardingAddress = process.env.FORWARDING_ADDRESS;
const crypto = require('crypto');
const cookie = require('cookie');
const dotenv = require('dotenv').config();
const Shop = require("../../models/Index").Shop;

//install app in shopify
exports.install = (req, res) => {
    const shop = req.query.shop;
    if (shop) {
        const state = nonce();
        const redirectUri = forwardingAddress + '/shopify/callback';
        const installUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&state=${state}&redirect_uri=${redirectUri}`;

        res.cookie('state', state);
        res.redirect(installUrl);
        console.log('phase 1');

    } else {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request');
    }
};

//callback authenticate for accessToken
exports.callback = (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;
    console.log('phase 2');
    if (state !== stateCookie) {
        return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
        const map = Object.assign({}, req.query);
        delete map['signature'];
        delete map['hmac'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', apiSecret)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        let hashEquals = false;
        // timingSafeEqual will prevent any timing attacks. Arguments must be buffers
        try {
            hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
            // timingSafeEqual will return an error if the input buffers are not the same length.
        } catch (e) {
            hashEquals = false;
        };

        if (!hashEquals) {
            return res.status(400).send('HMAC validation failed');
        }

        const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
        const accessTokenPayload = {
            client_id: apiKey,
            client_secret: apiSecret,
            code,
        };
        request.post(accessTokenRequestUrl, { json: accessTokenPayload })
            .then((accessTokenResponse) => {
                console.log(shop);
                const ShopRequest = `https://${shop}/admin/api/2020-10/shop.json`;
                const ShopRequestHeaders = {
                    'X-Shopify-Access-Token': accessTokenResponse.access_token,
                };
                console.log(accessTokenResponse.access_token);
                request.get(ShopRequest, { headers: ShopRequestHeaders })
                    .then((ShopResponse) => {
                        // res.setHeader('Content-Type', 'application/json');
                        ShopResponseJson = JSON.parse(ShopResponse).shop;
                        // res.send(ShopResponse);
                        console.log(ShopResponseJson.name);
                        if (req.session.shopUrl != shop) {
                            req.session.shopUrl = shop;
                        }
                        Shop.findOne({
                            where: {
                                shopUrl: shop
                            }
                        }).then((shopTB) => {
                            if (shopTB.shopUrl != shop) {
                                Shop.create({
                                    shopUrl: shop,
                                    accessToken: accessTokenResponse.access_token,
                                    shopName: ShopResponseJson.name,
                                    shopAddress: ShopResponseJson.address1,
                                    shopCity: ShopResponseJson.city,
                                    shopState: ShopResponseJson.province,
                                    shopCountry: ShopResponseJson.country,
                                    shopMail: ShopResponseJson.email
                                });
                                console.log("Shop details got!");
                            }
                        });
                        res.redirect(`${forwardingAddress}/api/orders?shop=${shop}`);
                    })
                    .catch((error) => {
                        console.log("fail");
                        res.status(error.statusCode).send(error.error.error_description);
                    });
                // TODO
                // Use access token to make API call to 'shop' endpoint
            })
            .catch((error) => {
                res.status(error.statusCode).send(error.error.error_description);
            });

        // TODO
        // Validate request is from Shopify
        // Exchange temporary code for a permanent access token
        // Use access token to make API call to 'shop' endpoint
    } else {
        res.status(400).send('Required parameters missing');
    }
};

exports.order = (req, res) => {
    const shop = req.query.shop;
    Shop.findOne({
        where: {
            shopUrl: shop
        }
    }).then(function (shopTB) {
        if (req.session.shopUrl == shop) {
            if (shopTB.accessToken) {
                const orderRequestUrl = `https://${shopTB.shopUrl}/admin/api/2020-10/orders.json?status=any`;
                const orderRequestHeaders = {
                    'X-Shopify-Access-Token': shopTB.accessToken,
                };

                // console.log(shopTB.accessToken+shopTB.shopUrl);
                request.get(orderRequestUrl, { headers: orderRequestHeaders })
                    .then((orderResponse) => {
                        res.setHeader('Content-Type', 'application/json');

                        console.log('pass 2');
                        console.log(orderResponse);
                        res.end(orderResponse)
                    })
                    .catch((error) => {
                        console.log("fail");
                        res.status(error.statusCode).send(error.error.error_description);
                    });
            } else {
                res.end('Error');
            }
        } else {
            res.end('You are not Authorise ');
        }
    });
}