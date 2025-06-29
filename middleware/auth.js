module.exports = {
  // Making sure user is logged in
  ensureAuth: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect('/login');
    }
  },
};
