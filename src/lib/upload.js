const multer = require("multer");
const fs = require("fs");

const upload = (destination, fileNamePrefix) => {
  console.log(`masuk upload`);
  const defaultPath = "./public";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("req :", req.files);
      console.log("file :", file);
      const dirAva = "/profile-picture";
      const dirCov = "/profile-cover";
      let directory;
      if (file.fieldname === "profile_picture") {
        directory = defaultPath + destination + dirAva;
      } else if (file.fieldname === "profile_cover") {
        directory = defaultPath + destination + dirCov;
      } else {
        directory = defaultPath + destination;
      }
      fs.existsSync(directory)
        ? cb(null, directory)
        : fs.mkdir(directory, { recursive: true }, (error) =>
            cb(error, directory)
          );
    },
    filename: function (req, file, cb) {
      let originalName = file.originalname;
      const fileAva = "AVATAR";
      const fileCov = "COVER";
      let extention = originalName.split(".");
      let fileName;
      if (file.fieldname === "profile_picture") {
        fileName = `${fileNamePrefix}${fileAva}${Date.now()}.${
          extention[extention.length - 1]
        }`;
      } else if (file.fieldname === "profile_cover") {
        fileName = `${fileNamePrefix}${fileCov}${Date.now()}.${
          extention[extention.length - 1]
        }`;
      } else {
        fileName = `${fileNamePrefix}${Date.now()}.${
          extention[extention.length - 1]
        }`;
      }
      console.log(fileName);
      cb(null, fileName);
    },
  });

  const fileFilter = function (req, file, cb) {
    const ext = /\.(jpg|jpeg|png|gif|JPEG|JPG)$/;
    if (!file.originalname.match(ext)) {
      return cb(new Error("Only listed file types are allowed"), false);
    }
    cb(null, true);
  };

  return multer({
    storage,
    fileFilter,
    //  limits: { fileSize: 2 * 1024 * 1024 }
  });
};

module.exports = { upload };
