import Product from '../models/product.js';
import Order from '../models/order.js';
import User from '../models/user.js';
export const getProducts = (req, res, next) => {
  // console.log('get products: ', req.user);
  Product.find()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // console.log(prodId);
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

export const getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getCart = (req, res, next) => {
  if (!req.user) {
    return res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: req.session.guestUser,
      isAuthenticated: req.session.isLoggedIn,
    });
  }

  console.log('get cart user: ', req.session.user.cart.items);
  req.user
    .populate('cart.items.productInfo')
    .execPopulate()
    .then((user) => {
      // console.log('get cart: ', user.cart.items);
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log('This error: ', err));
};

export const postCart = (req, res, next) => {
  const prodId = req.body.productId;

  Product.findById(prodId)
    .then((product) => {
      if (req.user) {
        req.user.addToCart(product);
        return res.redirect('/cart');
      }

      req.session.guestUser.push({
        _id: product._id,
        productInfo: {
          title: product.title,
          price: product.price,
          description: product.description,
          imageUrl: product.imageUrl,
        },
        quantity: 1,
      });

      res.redirect('/products');
    })
    .catch((error) => {
      console.log('post cart error: ', error);
      res.redirect('/');
    });
};

export const postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  console.log('productID to delete: ', prodId);

  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

export const postOrder = async (req, res, next) => {
  req.user
    .populate('cart.items.productInfo')
    .execPopulate()
    .then((user) => {
      // console.log('get cart: ', user.cart.items);
      const products = user.cart.items.map((product) => {
        return {
          quantity: product.quantity,
          product: product.productInfo._doc,
        };
      });

      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
        products,
      });
      order.save();
    })
    .then((result) => {
      //=== one way to clear the cart=====
      // User.findById(req.user._id).then((user) => {
      //   user.cart.items = [];
      //   user.save();
      // });
      req.user.clearCart();
    })
    .then(() => {
      console.log('user: ', req.user);
      req.session.user.cart.items = [];
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

export const getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      // console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
