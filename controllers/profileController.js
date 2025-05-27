const User = require("../models/User");

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
    const { ad, soyad, email, motto } = req.body;

    user.ad = ad;
    user.soyad = soyad;
    user.email = email;
    user.motto = motto;

    if (req.file) {
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
    res.render("profile/edit", {
      title: "Profili Düzenle",
      user: req.user,
      rol: req.user.rol,
      hata: "Bir hata oluştu.",
      basari: null
    });
  }
};
