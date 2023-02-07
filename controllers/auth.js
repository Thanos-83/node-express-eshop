import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import sendgridTransport from 'nodemailer-sendgrid-transport';
import crypto from 'crypto';
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key:
        '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',
    },
  })
);
export const getLoginPage = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMsg: req.flash('error'),
  });
};

export const postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password!');

        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then((passwordMatch) => {
          // console.log('Password match: ', passwordMatch);
          if (!passwordMatch) {
            return res.redirect('/login');
          } else {
            console.log('iam here user: ', user);
            req.session.isLoggedIn = true;
            // req.session.guestUser = false;
            req.session.user = user;
            req.session.save((error) => {
              // if (error) return next(error);
              console.log('Error insode login save sessio: ', error);
              return res.redirect('/');
            });
          }
        })
        .catch((error) => {
          console.log(error);
          res.redirect('/login');
        });
    })
    .catch((error) => {
      console.log('Error from login user: ', error);
    });
};

export const postLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.user = null;

  return res.redirect('/');
  // req.session.destroy((error) => {
  //   console.log('Error insode logout destroy session: ', error);
  //   return res.redirect('/');
  // });
};

export const getSignupPage = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Signup',
    path: '/signup',
    errorMsg: req.flash('error'),
  });
};

export const postSignup = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  // console.log(name, email, password);
  User.findOne({ email: email })
    .then((user) => {
      // console.log(user);
      if (user) {
        // console.log('iam here');
        req.flash('error', 'Email alrady exists!');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            name,
            email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then(() => {
          res.redirect('/login');
          return transporter.sendMail({
            to: email,
            from: 's_sbonias@hotmail.com',
            subject: 'Signup succeeded',
            html: '<h1>Successfuly signed up!</h1>',
          });
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const getResetPasswordPage = (req, res, next) => {
  res.render('auth/resetPassword', {
    pageTitle: 'Reset',
    path: '/reset',
    errorMsg: req.flash('error'),
  });
};

export const postResetPasswordPage = (req, res, next) => {
  console.log(req.body.email);
  if (!req.body.email) {
    req.flash('error', 'Please ender a valid email!');
    return res.redirect('/reset');
  }
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      console.log(error);
      res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    console.log('token: ', token);

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'No user with this email exists!');
          return res.redirect('/reset');
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect('/');
        return transporter
          .sendMail({
            to: req.body.email,
            from: 's_sbonias@hotmail.com',
            subject: 'Password reset',
            html: `<h1>You requested a password reset!</h1>
            <p>Please click this <a href="http://localhost:3000/reset/${token}" >link</a> to reset your password </p>
            `,
          })
          .catch((error) => {
            console.log(error);
          });
      });
  });
};

export const getNewPasswordPage = (req, res, next) => {
  const token = req.params.token;
  console.log(token);
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      res.render('auth/new-password', {
        pageTitle: 'Update Password',
        path: '/new-password',
        errorMsg: req.flash('error'),
        userId: user._id,
        userToken: token,
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

export const postNewPasswordPage = (req, res, next) => {
  const { password, userToken, userId } = req.body;
  let resetUser;
  User.findOne({
    resetToken: userToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect('/login');
    })
    .catch((error) => {
      console.log(error);
    });
};
