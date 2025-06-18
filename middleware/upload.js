const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

// Multer storage ayarı
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// Dosya filtresi
const fileFilter = function (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Geçersiz dosya formatı. Sadece jpeg, jpg, png yüklenebilir."), false);
  }
};

// Multer upload objesi
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 4 * 1024 * 1024 } // 4 MB sınırı
});

// Sharp ile sıkıştırma middleware
const uploadSharp = (req, res, next) => {
  if (!req.file) return next();

  const inputPath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase() || ".jpg";
  const outputFilename = req.file.filename + ext;
  const outputPath = path.join("public/uploads/", outputFilename);

  sharp(inputPath)
    .resize(300, 300, { fit: "inside" })
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(outputPath)
    .then(() => {
      fs.unlinkSync(inputPath);
      req.file.filename = outputFilename;
      req.file.path = outputPath;
      next();
    })
    .catch(err => {
      console.error("Sharp sıkıştırma hatası:", err);
      next(err);
    });
};

module.exports = { upload, uploadSharp };
