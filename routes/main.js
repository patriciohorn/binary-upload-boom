const express = require('express');
const router = express.Router();
const homeController = require('../controllers/home');
const authController = require('../controllers/auth');
const postController = require('../controllers/post');

router.get('/', homeController.getIndex);
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignUp);
router.post('/signup', authController.postSignup);
router.get('/profile', postController.getProfile);

module.exports = router;
