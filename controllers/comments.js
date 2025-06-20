const Comment = require('../models/Comment');

module.exports = {
  createComment: async (req, res) => {
    try {
      // add to comment collection
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
        user: req.user.id,
      });

      res.redirect(`/post/${req.params.id}`);
    } catch (error) {
      console.log(error);
      res.redirect(`/post/${req.params.id}`);
    }
  },
};
