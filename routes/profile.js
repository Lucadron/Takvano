const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { upload, uploadSharp } = require("../middleware/upload");
const profileController = require("../controllers/profileController");

router.get("/profil-goruntule", auth, profileController.viewProfile);
router.get("/profil-duzenle", auth, profileController.editProfileGet);
router.post("/profil-duzenle", auth, (req, res, next) => {
  upload.single("profilFoto")(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return profileController.renderError(req, res, "❌ Dosya boyutu 4 MB'den küçük olmalı.");
      } else if (err.message) {
        return profileController.renderError(req, res, err.message);
      } else {
        return profileController.renderError(req, res, "❌ Bir hata oluştu.");
      }
    }
    next();
  });
}, uploadSharp, profileController.editProfilePost);

module.exports = router;
