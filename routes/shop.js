import path from 'path';

import express from 'express';

import {
  getIndex,
  getProducts,
  getProduct,
  postCart,
  getCart,
  postCartDeleteProduct,
  postOrder,
  getOrders,
  displayProducts,
} from '../controllers/shop.js';

import isAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postCartDeleteProduct);

router.post('/create-order', isAuth, postOrder);

router.get('/orders', isAuth, getOrders);

router.get('/checkout', (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
    // products: req.session.guestUser,
    // isAuthenticated: req.session.isLoggedIn,
  });
});

router.get('/display-products', displayProducts);

export default router;
