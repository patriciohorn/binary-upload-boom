const multer = require('multer');
const path = require('path');

// multer accepts an options obect
module.exports = multer({
  // storage: where to store files, right now we're not saving to disk
  storage: multer.diskStorage({}),

  // Function to control which files are accpeted
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
