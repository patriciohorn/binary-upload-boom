const validator = require('validator');
const passport = require('passport');
const User = require('../models/User');

exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect('/profile');
  }
  res.render('login.ejs');
};

exports.postLogin = async (req, res, next) => {
  const validationErrors = [];

  if (!validator.isEmail(req.body.email))
    validationErrors.push({
      msg: 'Please enter a valid email address',
    });

  if (validator.isEmpty(req.body.password))
    validationErrors.push({
      msg: 'Password cannot be blank.',
    });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/login');
  }

  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      req.flash('errors', info);
      return res.redirect('/login');
    }

    // Passport method that creates a session for the logged-in user, saves the user ID into te session, makes req.user available in future requests
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect(req.session.returnTo || '/profile');
    });
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) console.log('Error : Failed to logout.', err);
    req.session.destroy((err) => {
      if (err)
        console.log(
          'Error : Failed to destroy the session during logout.',
          err
        );
      req.user = null;
      res.redirect('/');
    });
  });
};

exports.getSignUp = (req, res) => {
  res.render('signup.ejs');
};

exports.postSignup = async (req, res, next) => {
  const validationErrors = [];
  // We use validator library to validate and sanitize strings

  // validate email
  // isEmail: check if string is an email
  if (!validator.isEmail(req.body.email)) {
    validationErrors.push({ msg: 'Please enter a valid email' });
  }

  // validate password
  // isLength: check if string length falls in a range
  if (!validator.isLength(req.body.password, { min: 8 })) {
    validationErrors.push({
      msg: 'Password must be at least 8 characters long',
    });
  }
  if (req.body.password !== req.body.confirmPassword) {
    validationErrors.push({ msg: 'Password do not match' });
  }

  if (validationErrors.length) {
    console.log(validationErrors);
    req.flash('errors', validationErrors);
    return res.redirect('../signup');
  }

  // Canonicalize (convert something into a standards or accepted form) an email address
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  try {
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { userName: req.body.userName },
      ],
    });

    if (existingUser) {
      req.flash('errors', {
        msg: 'Account with that email address or username already exists',
      });
      return res.redirect('../signup');
    }

    const user = new User({
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    // I can use also logIn. aliased: shortcut or alternative name for the same thing
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/profile');
    });
  } catch (error) {
    return next(error);
  }
};
