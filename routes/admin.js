import path from 'path';
import express from 'express';
import {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} from '../controllers/admin.js';

import isAuthenticated from '../middleware/authMiddleware.js';

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuthenticated, getAddProduct);

// // /admin/products => GET
router.get('/products', isAuthenticated, getProducts);

// /admin/add-product => POST
router.post('/add-product', isAuthenticated, postAddProduct);

router.get('/edit-product/:productId', isAuthenticated, getEditProduct);

router.post('/edit-product', isAuthenticated, postEditProduct);

router.post('/delete-product', isAuthenticated, postDeleteProduct);

export default router;
