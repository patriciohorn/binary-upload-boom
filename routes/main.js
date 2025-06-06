const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth');
const postsController = require('../controllers/post');
const { ensureAuth } = require('../middleware/auth');

router.get('/', homeController.getIndex);
router.get('/profile', ensureAuth, postsController.getProfile);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignup);
router.get('/logout', authController.logout);

module.exports = router;
