// const Product = require('../models/product');
import Product from '../models/product.js';

export const getAddProduct = (req, res, next) => {
  // if (req.session.csrfToken !== req.body._csrf) {
  //   res.status(401).json({ message: 'unauthorized!' });
  //   return;
  // }
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    // isAuthenticated: req.session.isLoggedIn,
    errorMsg: '',
  });
};

export const postAddProduct = (req, res, next) => {
  if (req.session.csrfToken !== req.body._csrf) {
    res.status(401).json({ message: 'unauthorized!' });
    return;
  }
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const newProduct = {
    title,
    price,
    description,
    imageUrl,
    // null,
    userId: req.user ? req.user._id : null,
  };
  const product = new Product(newProduct);
  product
    .save()
    .then((result) => {
      console.log('Created Product: ', result);
      // console.log('Created Product');
      res.status(200).redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getEditProduct = (req, res, next) => {
  // if (req.session.csrfToken !== req.body._csrf) {
  //   res.status(401).json({ message: 'unauthorized!' });
  //   return;
  // }
  console.log('Edit Product: ', req.user);

  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect('/');
      }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        errorMsg: '',
        // isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const postEditProduct = (req, res, next) => {
  if (req.session.csrfToken !== req.body._csrf) {
    res.status(401).json({ message: 'unauthorized!' });
    return;
  }
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      (product.title = updatedTitle),
        (product.price = updatedPrice),
        (product.description = updatedDesc),
        (product.imageUrl = updatedImageUrl);

      return product.save();
    })
    .then((result) => {
      console.log('UPDATED PRODUCT! ', result);
      res.status(200).redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

export const getProducts = (req, res, next) => {
  // if (req.session.csrfToken !== req.body._csrf) {
  //   res.status(401).json({ message: 'unauthorized!' });
  //   return;
  // }
  Product.find()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const postDeleteProduct = (req, res, next) => {
  if (req.session.csrfToken !== req.body._csrf) {
    res.status(401).json({ message: 'unauthorized!' });
    return;
  }
  const prodId = req.body.productId;
  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};
