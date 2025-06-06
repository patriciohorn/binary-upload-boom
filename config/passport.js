const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const mongoose = require('mongoose');

// Verify function that passport will call on login

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          // Fetch the user record from the databas
          const user = await User.findOne({
            email: email.toLowerCase(),
          });

          if (!user) {
            return done(null, false, {
              msg: `Email ${email} not found.`,
            });
          }

          if (!user.password) {
            return done(null, false, {
              msg: 'Your account was registered using a sign-in provider. To enable password login, sign in using your provider, and then set a password under your user profile.',
            });
          }

          // Verify the hashed password against the password submitted by the user
          const isMatch = await user.comparePassword(password);

          // done function to signal the result of authentication process. Must call it once the user is verified
          // done(error, user, info optional)
          if (isMatch) {
            // Ait sicess -> Logs in the user
            return done(null, user);
          } else {
            // Auth failed, with flash message
            return done(null, false, {
              msg: 'Invalid email or password.',
            });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // setores user's ID in the session after login
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Retrieves the full user from DB using the sotred ID
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
