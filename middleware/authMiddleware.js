export default function (req, res, next) {
  // console.log(req.session.isLoggedIn);
  if (req.session.isLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}
