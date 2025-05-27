const User = require("../models/User");
//Şifre Değiştirme
const bcrypt = require("bcrypt");

//Organizator listele
exports.listOrganizators = async (req, res) => {
  const organizators = await User.find({ rol: "Organizator" });
  res.render("organizers/list", {
    title: "Organizatörler",
    organizators
  });
};

//Organizator detay
exports.organizatorDetail = async (req, res) => {
  const id = req.params.id;
  const organizator = await User.findById(id);

  if (!organizator || organizator.rol !== "Organizator") {
    return res.redirect("/");
  }

  const ziyaretci = await User.findById(req.user.id);
  const favorideMi = ziyaretci.favoriler.includes(organizator._id);

  const mesaj = req.app.locals.mesaj || null;
  req.app.locals.mesaj = null; // mesajı tek sefer göster

  res.render("organizers/detail", {
    title: `${organizator.ad} ${organizator.soyad} – Profil`,
    organizator,
    favorideMi,
    mesaj
  });
};

//Favori işlemleri
exports.toggleFavorite = async (req, res) => {
  const ziyaretci = await User.findById(req.user.id);
  const organizatorId = req.params.id;

  const zatenFavoride = ziyaretci.favoriler.includes(organizatorId);

  if (zatenFavoride) {
    ziyaretci.favoriler.pull(organizatorId); // kaldır
    req.app.locals.mesaj = "Favorilerden kaldırıldı.";
  } else {
    ziyaretci.favoriler.push(organizatorId); // ekle
    req.app.locals.mesaj = "Favorilere eklendi!";
  }

  await ziyaretci.save();
  res.redirect("/organizator/" + organizatorId);
};

//Favori getirme
exports.getFavorites = async (req, res) => {
  const user = await User.findById(req.user.id).populate("favoriler");
  res.render("organizers/favorites", {
    title: "Favorilerim",
    favoriler: user.favoriler
  });
};

//Şifre Değiştirme GET
exports.getChangePassword = (req, res) => {
  res.render("auth/changePassword", {
    title: "Şifre Değiştir",
    hata: null,
    basari: null
  });
};

//Şifre Değiştirme POST
exports.postChangePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  const user = await require("../models/User").findById(req.user.id);

  const dogruMu = await bcrypt.compare(oldPassword, user.sifre);
  if (!dogruMu) {
    return res.render("auth/changePassword", { title: "Şifre Değiştir", hata: "Mevcut şifreniz yanlış.", basari: null });
  }

  if (newPassword !== confirmPassword) {
    return res.render("auth/changePassword", { title: "Şifre Değiştir", hata: "Yeni şifreler eşleşmiyor.", basari: null });
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  user.sifre = hash;
  await user.save();

  res.render("auth/changePassword", { title: "Şifre Değiştir", hata: null, basari: "Şifreniz başarıyla güncellendi." });
};

//Ziyaretci profili görüntüle
exports.viewVisitorProfile = async (req, res) => {
  const user = await require("../models/User").findById(req.params.id);
  if (!user || user.rol !== "Ziyaretci") {
    return res.redirect("/dashboard");
  }

res.render("profile/public-visitor", {
  title: "Ziyaretçi Profili",
  user: req.user, // oturum sahibi
  profil: user    // ziyaretçinin bilgisi
});
};
