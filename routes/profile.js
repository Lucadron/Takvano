const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const profileController = require("../controllers/profileController");

//Organizator Profil sayfası
router.get("/profil", auth, profileController.organizatorProfileGet);
router.post("/profil", auth, upload.single("profilFoto"), profileController.organizatorProfilePost);

//Ziyaretci profil
router.get("/profilim", auth, profileController.ziyaretciProfilGet);
router.post("/profilim", auth, upload.single("profilFoto"), profileController.ziyaretciProfilPost);

module.exports = router;
