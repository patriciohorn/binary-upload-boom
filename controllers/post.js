const Post = require('../models/Post');
const cloudinary = require('../middleware/cloudinary');

module.exports = {
  getProfile: async (req, res) => {
    try {
      console.log(req.sessionID);
      res.render('profile.ejs', { user: req.user.userName });
    } catch (error) {
      console.log(error);
    }
  },

  createPost: async (req, res) => {
    try {
      console.log(req.file.path);
      console.log(req.user.id);
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloduinaryId: result.public_id,
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
};
