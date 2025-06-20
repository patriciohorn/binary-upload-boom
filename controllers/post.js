const Post = require('../models/Post');
const cloudinary = require('../middleware/cloudinary');
const Comment = require('../models/Comment');

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

      res.render('feed.ejs', { posts: posts });
    } catch (error) {
      console.log(error);
    }
  },

  getPost: async (req, res) => {
    try {
      // go to DB
      // Find the post that has the same id as the :id query parameter
      const post = await Post.findById(req.params.id).populate(
        'user',
        'userName'
      );
      const comments = await Comment.find({
        post: req.params.id,
      })
        .sort({ createdAt: 'desc' })
        .lean();

      res.render('post.ejs', {
        post: post,
        user: req.user,
        comments: comments,
      });
    } catch (error) {
      console.log(error);
    }
  },

  likePost: async (req, res) => {
    try {
      // find the post
      let post = await Post.findByIdAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 } }
      );
      console.log('Likes +1');
      res.redirect(`/post/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      console.log(post.cloudinaryId);
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Remove from database
      await Post.deleteOne({ _id: req.params.id });

      console.log('Deleted Post');
      res.redirect('/profile');
    } catch (err) {
      console.log(err);
      res.redirect('/profile');
    }
  },
};
