const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Notification = require("../models/Notification");

// 🔔 Bildirimleri listele
router.get("/", auth, async (req, res) => {
  const bildirimler = await Notification.find({ user: req.user.id })
    .sort({ tarih: -1 })
    .populate("sender", "ad soyad rol");

  res.render("notifications/index", {
    title: "Bildirimler",
    user: req.user,
    bildirimler
  });
});

// 🔘 Okundu / okunmadı toggle
router.post("/toggle/:id", auth, async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (notif && notif.user.toString() === req.user.id) {
    notif.okundu = !notif.okundu;
    await notif.save();
  }
  res.redirect("/bildirimler");
});

// 🗑 Tek tek bildirim sil
router.post("/sil/:id", auth, async (req, res) => {
  await Notification.deleteOne({ _id: req.params.id, user: req.user.id });
  res.redirect("/bildirimler");
});

// 🧹 Tüm bildirimleri sil
router.post("/tumunu-sil", auth, async (req, res) => {
  await Notification.deleteMany({ user: req.user.id });
  res.redirect("/bildirimler");
});

module.exports = router;
