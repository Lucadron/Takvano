const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/adminController");

router.get("/admin", auth, isAdmin, adminController.panel);
router.post("/admin/kullanici-sil/:id", auth, isAdmin, adminController.silKullanici);
router.post("/admin/randevu-sil/:id", auth, isAdmin, adminController.silRandevu);
router.get("/admin/kullanici-duzenle/:id", auth, isAdmin, adminController.kullaniciGetir);
router.post("/admin/kullanici-duzenle/:id", auth, isAdmin, adminController.kullaniciGuncelle);

module.exports = router;
