const express = require('express');

const productController = require('../controllers/productController');

const router = express.Router();

router.get('/details/:slug', productController.getProductBySlug);

router
    .route('/')
    .get(productController.getAllProducts)
    .post(productController.createProduct);

router
    .route('/:id')
    .get(productController.getProductById)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);

module.exports = router;
