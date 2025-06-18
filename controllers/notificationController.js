const Notification = require("../models/Notification");

exports.listele = async (req, res) => {
  const bildirimler = await Notification.find({ user: req.user.id })
    .sort({ tarih: -1 })
    .populate("sender", "ad soyad rol");

  res.render("notifications/index", {
    title: "Bildirimler",
    user: req.user,
    bildirimler
  });
};

exports.toggle = async (req, res) => {
  const notif = await Notification.findById(req.params.id);
  if (notif && notif.user.toString() === req.user.id) {
    notif.okundu = !notif.okundu;
    await notif.save();
  }
  res.redirect("/bildirimler");
};

exports.sil = async (req, res) => {
  await Notification.deleteOne({ _id: req.params.id, user: req.user.id });
  res.redirect("/bildirimler");
};

exports.tumunuSil = async (req, res) => {
  await Notification.deleteMany({ user: req.user.id });
  res.redirect("/bildirimler");
};

exports.tumunuOkunduYap = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user.id, okundu: false }, { $set: { okundu: true } });
    res.redirect("/bildirimler");
  } catch (err) {
    console.error("Tümünü okundu yaparken hata:", err);
    res.redirect("/bildirimler");
  }
};
