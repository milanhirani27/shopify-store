const express = require('express');
const router = express.Router();
const shopifyController = require('../controller/shopifyController');

router.get('/', shopifyController.test);

router.get('/shopify', shopifyController.shopify);

router.get('/shopify/callback', shopifyController.shopifyCallback);

router.get('/app/products', shopifyController.getProducts);

router.get('/app/checkout', shopifyController.checkouts);

router.get('/app/orders', shopifyController.orders);

router.get('/app/customer', shopifyController.customers);

module.exports = router
