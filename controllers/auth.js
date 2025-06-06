const validator = require('validator');

exports.getLogin = (req, res) => {
  res.render('login.ejs');
};

exports.postLogin = (req, res) => {
  res.redirect('/profile');
};

exports.getSignUp = (req, res) => {
  res.render('signup.ejs');
};

exports.postSignup = (req, res) => {
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
    req.flash('errors', validationErrors);
  }
  // if there's an error on the user signup
  // tell the user something needs to be fixed
  // if there's no error
  // normalize the email
  // create a new user
  // save it to DB
  // send the user to their new profile

  res.redirect('/profile');
};
