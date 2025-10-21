const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create folders if not exist
const createFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "uploads/";

    if (file.fieldname === "categoryImage") folder += "categories/";
    if (file.fieldname === "subcategoryImage") folder += "subcategories/";

    createFolder(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

module.exports = upload;
