import express from 'express';

import {
  getLoginPage,
  postLogin,
  postLogout,
  getSignupPage,
  postSignup,
  getResetPasswordPage,
  postResetPasswordPage,
  getNewPasswordPage,
  postNewPasswordPage,
} from '../controllers/auth.js';

const router = express.Router();

router.get('/login', getLoginPage);
router.post('/login', postLogin);
router.post('/logout', postLogout);
router.get('/signup', getSignupPage);
router.post('/signup', postSignup);
router.get('/reset', getResetPasswordPage);
router.post('/reset', postResetPasswordPage);
router.get('/reset/:token', getNewPasswordPage);
router.post('/reset-password', postNewPasswordPage);

export default router;
