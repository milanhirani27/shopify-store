const dotenv = require('dotenv').config();
const cookie = require('cookie');
const requestPromise = require('request-promise');
const ShopifyToken = require('shopify-token');
const scopes = ["read_checkouts", "read_customers", "read_orders", "read_fulfillments", "read_products"];
const forwardingAddress = "https://7f17-136-233-165-123.ngrok.io"

var shopifyToken = new ShopifyToken({
    sharedSecret: process.env.SHOPIFY_API_SECRET,
    redirectUri: forwardingAddress + '/shopify/callback',
    apiKey: process.env.SHOPIFY_API_KEY
})

exports.test = (req, res) => {
    res.send('hello')
}

exports.shopify = (req, res) => {
    const shop = req.query.shop;
    console.log('-->', shop);
    if (!shop) {
        return res.status(400).send('Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request')
    }
    const shopRegex = /^([\w-]+)\.myshopify\.com/i
    const shopName = shopRegex.exec(shop)[1]
    const state = shopifyToken.generateNonce();
    const url = shopifyToken.generateAuthUrl(shopName, scopes, state);
    res.cookie('state', state);
    res.redirect(url);
};

exports.shopifyCallback = async (req, res) => {
    const { shop, hmac, code, state } = req.query;
    const stateCookie = cookie.parse(req.headers.cookie).state;

    if (state !== stateCookie) {
        // you are unable to set proper state ("nonce") in this case, thus you are getting this error
        return res.status(403).send('Request origin cannot be verified')
    }
    if (!shop || !hmac || !code) {
        res.status(400).send('Required parameters missing')
    }
    let hmacVerified = shopifyToken.verifyHmac(req.query)
    console.log(`verifying -> ${hmacVerified}`)

    // DONE: Validate request is from Shopify
    if (!hmacVerified) {
        return res.status(400).send('HMAC validation failed')
    }
    const accessToken = await (await shopifyToken.getAccessToken(shop, code)).access_token;
    console.log('s', accessToken);
    const shopRequestUrl = 'https://' + shop + '/admin/products.json'
    const shopRequestHeaders = {
        'X-Shopify-Access-Token': accessToken
    }
    try {
        const shopResponse = requestPromise.get(shopRequestUrl, { headers: shopRequestHeaders })
        await res.status(200).send(shopResponse)
    } catch (error) {
        res.status(error.statusCode).send(error.error.error_description)
    }

};

exports.getProducts = function (req, res, next) {

    // let url = 'https://' + req.query.shop + '/admin/api/2021-10/products.json';
    let url = 'https://testing-demo-product.myshopify.com/admin/api/2021-10/products.json';

    console.log('URL', url);
    let options = {
        method: "GET",
        uri: url,
        json: true,
        headers: {
            'X-Shopify-Access-Token': process.env.X_Shopify_Access_Token,
            'content-type': 'application/json'
        }
    };

    requestPromise(options)
        .then((response) => {
            console.log('res', response);
            res.status(200).send(response);
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err)
        })
}

exports.checkouts = function (req, res, next) {

    let url = 'https://testing-demo-product.myshopify.com/admin/api/2021-10/checkouts.json';

    let options = {
        method: "GET",
        uri: url,
        json: true,
        headers: {
            'X-Shopify-Access-Token': process.env.X_Shopify_Access_Token,
            'content-type': 'application/json'
        }
    };

    requestPromise(options)
        .then((response) => {
            console.log('res', response);
            res.status(200).send(response);
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err)
        })
}

exports.orders = function (req, res, next) {

    let url = 'https://testing-demo-product.myshopify.com/admin/api/2021-10/orders.json?updated_at_min=2005-07-31T15%3A57%3A11-04%3A00';

    let options = {
        method: "GET",
        uri: url,
        json: true,
        headers: {
            'X-Shopify-Access-Token': process.env.X_Shopify_Access_Token,
            'content-type': 'application/json'
        }
    };

    requestPromise(options)
        .then((response) => {
            console.log('res', response);
            res.status(200).send(response);
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err)
        })
}

exports.customers = function (req, res, next) {

    let url = 'https://testing-demo-product.myshopify.com/admin/api/2021-10/customers.json';

    let options = {
        method: "GET",
        uri: url,
        json: true,
        headers: {
            'X-Shopify-Access-Token': process.env.X_Shopify_Access_Token,
            'content-type': 'application/json'
        }
    };

    requestPromise(options)
        .then((response) => {
            console.log('res', response);
            res.status(200).send(response);
        })
        .catch(function (err) {
            console.log(err);
            res.status(500).send(err)
        })
}
