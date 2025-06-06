module.exports = {
  getProfile: async (req, res) => {
    try {
      console.log(req.sessionID);
      res.render('profile.ejs', { user: req.user.userName });
    } catch (error) {
      console.log(error);
    }
  },
};
