const User = require("../models/User");
const fs = require("fs");
const path = require("path");


// Profil Görüntüleme
exports.viewProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile/view", {
    title: "Profil",
    user,
    rol: user.rol
  });
};

// Profil Düzenleme GET
exports.editProfileGet = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile/edit", {
    title: "Profili Düzenle",
    user,
    rol: user.rol,
    hata: null,
    basari: null
  });
};

// Profil Düzenleme POST
exports.editProfilePost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.redirect("/");

    const { ad, soyad, email, motto } = req.body;

    user.ad = ad;
    user.soyad = soyad;
    user.email = email;
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

    res.render("profile/edit", {
      title: "Profili Düzenle",
      user,
      rol: user.rol,
      hata: null,
      basari: "✅ Profil başarıyla güncellendi."
    });
  } catch (err) {
    console.error("Profil güncelleme hatası:", err);
    const fallbackUser = await User.findById(req.user.id);
    res.render("profile/edit", {
      title: "Profili Düzenle",
      user: fallbackUser,
      rol: fallbackUser.rol,
      hata: "❌ Bir hata oluştu.",
      basari: null
    });
  }
};

exports.renderError = async (req, res, hataMesaji) => {
  const user = await User.findById(req.user.id);
  res.render("profile/edit", {
    title: "Profili Düzenle",
    user,
    rol: user.rol,
    hata: hataMesaji,
    basari: null
  });
};
