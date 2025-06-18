const User = require("../models/User");
const Appointment = require("../models/Appointment");
const fs = require("fs");
const path = require("path");


exports.panel = async (req, res) => {
  const users = await User.find();
  const randevular = await Appointment.find()
    .populate("organizator", "ad soyad")
    .populate("ziyaretci", "ad soyad")
    .sort({ tarih: -1 });

  res.render("admin/panel", {
    title: "Admin Paneli",
    users,
    user: req.user,
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
  const user = await User.findById(req.params.id);
  if (!user) return res.redirect("/admin");
  res.render("admin/editUser", {
    title: "Kullanıcıyı Düzenle",
    user,
    hata: null,
    basari: null
  });
};

exports.kullaniciGuncelle = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.redirect("/admin");

    const { ad, soyad, email, rol, motto } = req.body;

    user.ad = ad;
    user.soyad = soyad;
    user.email = email;
    user.rol = rol;
    user.motto = motto;
    user.calismaSaatleri = {
      baslangic: req.body["calismaSaatleri.baslangic"] || "08:00",
      bitis: req.body["calismaSaatleri.bitis"] || "17:00"
    };

    if (req.file && req.file.filename) {
      // Eski fotoğrafı sil (ppbos.jpg değilse)
      if (user.profilFoto && user.profilFoto !== "/uploads/ppbos.jpg") {
        const eskiDosyaYolu = path.join(__dirname, "..", "public", user.profilFoto);
        fs.unlink(eskiDosyaYolu, (err) => {
          if (err) {
            console.warn("⚠️ Eski foto silinemedi:", err.message);
          } else {
            console.log("✅ Eski foto silindi:", eskiDosyaYolu);
          }
        });
      }

      // Yeni foto yolu ata
      user.profilFoto = "/uploads/" + req.file.filename;
    }

    await user.save();

    res.render("admin/editUser", {
      title: "Kullanıcıyı Düzenle",
      user,
      hata: null,
      basari: "✅ Kullanıcı başarıyla güncellendi."
    });
  } catch (err) {
    console.error("Admin kullanıcı güncelleme hatası:", err);
    const fallbackUser = await User.findById(req.params.id);
    res.render("admin/editUser", {
      title: "Kullanıcıyı Düzenle",
      user: fallbackUser,
      hata: "❌ Bir hata oluştu.",
      basari: null
    });
  }
};

exports.renderError = async (req, res, userId, hataMesaji) => {
  const user = await User.findById(userId);
  res.render("admin/editUser", {
    title: "Kullanıcıyı Düzenle",
    user,
    hata: hataMesaji,
    basari: null
  });
};
