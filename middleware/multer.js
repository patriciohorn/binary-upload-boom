const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);

    // Reject the file, pass false
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      cb(new Error('File type is not supported'), false);
      return;
    }

    // Accept the file, pass true
    cb(null, true);
  },
});
