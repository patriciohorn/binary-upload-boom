const express = require('express');
const routes = express.Router();
const postController = require('../controllers/post');

routes.post('/createPost', postController.createPost);

module.exports = routes;
