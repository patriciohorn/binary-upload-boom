const express = require('express');
const routes = express.Router();
const postsController = require('../controllers/post');
const { ensureAuth } = require('../middleware/auth');

// Multer adds file object to the request object. The file object contains the files uploaded via the form
// here we're doing:
// cosnt upload = multer({...})
const upload = require('../middleware/multer');

// .single(): method of the Update object. Accepts a single file with the 'name' fieldname (attribute?)
routes.get('/:id', ensureAuth, postsController.getPost);
routes.post(
  '/createPost',
  upload.single('file'),
  postsController.createPost
);
routes.put('/likePost/:id', postsController.likePost);
routes.delete('/deletePost/:id', postsController.deletePost);

module.exports = routes;
