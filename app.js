import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import parseurl from 'parseurl';
import MongoConnect from 'connect-mongodb-session';
import { get404 } from './controllers/error.js';
import User from './models/user.js';
import csrf from 'csurf';
import flash from 'connect-flash';

// ===== Routes ===========
import adminRoutes from './routes/admin.js';
import shopRoutes from './routes/shop.js';
import authRoutes from './routes/auth.js';
// ========================

const app = express();

const csrfProtection = csrf();
const __dirname = path.resolve();
const MongoDBStore = MongoConnect(session);

var store = new MongoDBStore({
  uri: 'mongodb+srv://eshop_cart:eshop_cart@eshop-cart.t4y8oxf.mongodb.net/eshop?retryWrites=true&w=majority',
  collection: 'sessions',
});
// Catch errors
store.on('error', function (error) {
  console.log('MongoDB session errors: ', error);
});
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

// === Session middlware=======
app.use(
  session({
    secret: 'some long string for production',
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
    store: store,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(csrfProtection);
app.use(flash());

// === A simple example using express-session to store page views for a user====
app.use((req, res, next) => {
  if (!req.session.views) {
    req.session.views = {};
  }

  // get the url pathname
  var pathname = parseurl(req).pathname;

  // count the views
  req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;
  next();
});
app.use((req, res, next) => {
  if (!req.session.user) {
    if (!req.session.guestUser) {
      req.session.guestUser = [];
    }
    return next();
  }

  console.log('middleware user: ', req.session.user._id);

  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

//=== pass local variables to all routes ========
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
    ? req.session.isLoggedIn
    : false;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(get404);

mongoose
  .connect(
    'mongodb+srv://eshop_cart:eshop_cart@eshop-cart.t4y8oxf.mongodb.net/eshop?retryWrites=true&w=majority',
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    }
  )
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
