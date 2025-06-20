const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const flash = require('express-flash');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const mainRoutes = require('./routes/main');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const { passUser } = require('./middleware/user');
// Tells the app where to find our env variables
dotenv.config({ path: './config/.env' });
// Passport config
require('./config/passport')(passport);

// Connecting to DB
connectDB();

// Middlewares
app.set('view-engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(logger('dev'));

app.use(methodOverride('_method'));

// Setup Sessions - Stored in MongoDB
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_STRING,
    }),
  })
);

app.use(passUser);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Use flash messages for errors, info, etc.
app.use(flash());

app.use('/', mainRoutes);
app.use('/post', postRoutes);
app.use('/comment', commentRoutes);

app.listen(process.env.PORT || 4242, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
