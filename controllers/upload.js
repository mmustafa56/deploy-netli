const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    cb(null, path.join(__dirname, "../upload/image"));
  },

  filename: async (req, file, cb) => {
    cb(null, file.fieldname + Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

module.exports = upload;
