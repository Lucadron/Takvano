const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const profileController = require("../controllers/profileController");

router.get("/profil-goruntule", auth, profileController.viewProfile);
router.get("/profil-duzenle", auth, profileController.editProfileGet);
router.post("/profil-duzenle", auth, upload.single("profilFoto"), profileController.editProfilePost);

module.exports = router;
