const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/database');
const flash = require('express-flash');
// Tells the app where to find our env variables
dotenv.config({ path: './config/.env' });

// Importing Routes
const mainRoutes = require('./routes/main');

// Connecting to DB
connectDB();

// Middlewares
app.set('view-engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Use flash messages for errors, info, etc.
app.use(flash());

app.use('/', mainRoutes);

app.listen(process.env.PORT || 4242, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
