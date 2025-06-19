const Post = require('../models/Post');
const cloudinary = require('../middleware/cloudinary');
const User = require('../models/User');

module.exports = {
  getProfile: async (req, res) => {
    try {
      // go to the database and find the post for the logged in user
      const userPosts = await Post.find({ user: req.user.id });

      res.render('profile.ejs', {
        user: req.user.userName,
        posts: userPosts,
      });
    } catch (error) {
      console.log(error);
    }
  },

  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });

      console.log('Post has been added to DB');
      res.redirect('/profile');
    } catch (error) {
      console.log(error);
    }
    // add it to the database
    // two ways to save to database
    // save() more control
    // create()
  },

  getFeed: async (req, res) => {
    try {
      const posts = await Post.find()
        .sort({ createdAt: 'desc' })
        .populate('user', 'userName')
        .lean();
      console.log(posts);
      res.render('feed.ejs', { posts: posts });
    } catch (error) {
      console.log(error);
    }
  },

  getPost: async (req, res) => {
    try {
      // go to DB
      // Find the post that has the same id as the :id query parameter
      const post = await Post.findById(req.params.id);
      // console.log(req.user.id, post.user);
      res.render('post.ejs', { post: post, user: req.user });
    } catch (error) {
      console.log(error);
    }
  },
};
