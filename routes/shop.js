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

export default router;
