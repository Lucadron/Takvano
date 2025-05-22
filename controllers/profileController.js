const User = require("../models/User");

//Organizator profil
exports.organizatorProfileGet = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile/organizator", {
    title: "Profilim",
    user,
    hata: null,      // Bu satır eksik olduğu için hata alıyorsun
    basari: null
  });
};

//Organizator profil
exports.organizatorProfilePost = async (req, res) => {
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
    res.render("profile/organizator", {
      title: "Profilim",
      user,
      hata: null,
      basari: "Profil başarıyla güncellendi."
    });
  } catch (err) {
    console.error(err);
    res.render("profile/organizator", {
      title: "Profilim",
      user: req.user,
      hata: "Bir hata oluştu.",
      basari: null
    });
  }
};

//Ziyaretci profil get
exports.ziyaretciProfilGet = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.render("profile/ziyaretci", {
    title: "Profilim",
    user,
    mesaj: null
  });
};

//Ziyaretci profil post
exports.ziyaretciProfilPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const { ad, soyad, motto } = req.body;

    user.ad = ad;
    user.soyad = soyad;
    user.motto = motto;

    if (req.file) {
      user.profilFoto = "/uploads/" + req.file.filename;
    }

    await user.save();
    res.render("profile/ziyaretci", {
      title: "Profilim",
      user,
      mesaj: "Profil başarıyla güncellendi."
    });
  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
  }
};
