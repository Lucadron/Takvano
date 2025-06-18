const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const notificationController = require("../controllers/notificationController");

// 🔔 Bildirimleri listele
router.get("/", auth, notificationController.listele);

// 🔘 Okundu / okunmadı toggle
router.post("/toggle/:id", auth, notificationController.toggle);

// 🗑 Tek tek bildirim sil
router.post("/sil/:id", auth, notificationController.sil);

// 🧹 Tüm bildirimleri sil
router.post("/tumunu-sil", auth, notificationController.tumunuSil);

// ✅ Tüm bildirimi okundu olarak işaretle
router.post("/tumunu-okundu", auth, notificationController.tumunuOkunduYap);

module.exports = router;
