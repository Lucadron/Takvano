const User = require("../models/User");
const Appointment = require("../models/Appointment");

exports.panel = async (req, res) => {
  const users = await User.find();
  const randevular = await Appointment.find()
    .populate("organizator", "ad soyad")
    .populate("ziyaretci", "ad soyad")
    .sort({ tarih: -1 });

  res.render("admin/panel", {
    title: "Admin Paneli",
    users,
    randevular
  });
};

exports.silKullanici = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
};

exports.silRandevu = async (req, res) => {
  await Appointment.findByIdAndDelete(req.params.id);
  res.redirect("/admin");
};


exports.kullaniciGetir = async (req, res) => {
  const user = await require("../models/User").findById(req.params.id);
  if (!user) return res.redirect("/admin");
  res.render("admin/editUser", { title: "Kullanıcıyı Düzenle", user });
};

exports.kullaniciGuncelle = async (req, res) => {
  const { ad, soyad, email, rol, motto } = req.body;
  await require("../models/User").findByIdAndUpdate(req.params.id, {
    ad,
    soyad,
    email,
    rol,
    motto
  });
  res.redirect("/admin");
};
