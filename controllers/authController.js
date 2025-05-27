const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Notification = require("../models/Notification");

// Token üretici fonksiyon
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, rol: user.rol, ad: user.ad },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

// GET: Kayıt formu
exports.registerGet = (req, res) => {
  res.render("auth/register", { title: "Kayıt Ol", hata: null });
};

// POST: Kayıt işlemi
exports.registerPost = async (req, res) => {
  const { ad, soyad, email, sifre, rol } = req.body;
  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("auth/register", {
        title: "Kayıt Ol",
        hata: "Bu e-posta zaten kayıtlı!"
      });
    }

    const newUser = new User({ ad, soyad, email, sifre, rol });
    await newUser.save();

    const token = generateToken(newUser);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (err) {
    res.render("auth/register", {
      title: "Kayıt Ol",
      hata: "Kayıt sırasında hata oluştu!"
    });
  }
};

// GET: Giriş formu
exports.loginGet = (req, res) => {
  res.render("auth/login", { title: "Giriş Yap", hata: null });
};

// POST: Giriş işlemi
exports.loginPost = async (req, res) => {
  const { email, sifre } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", {
        title: "Giriş Yap",
        hata: "Kullanıcı bulunamadı!"
      });
    }

    const dogruMu = await bcrypt.compare(sifre, user.sifre);
    if (!dogruMu) {
      return res.render("auth/login", {
        title: "Giriş Yap",
        hata: "Şifre hatalı!"
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (err) {
    res.render("auth/login", {
      title: "Giriş Yap",
      hata: "Giriş sırasında hata oluştu!"
    });
  }
};

// Çıkış
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

//Dashboard
exports.dashboard = async (req, res) => {
  const bildirimler = await Notification.find({ user: req.user.id })
    .sort({ tarih: -1 })
    .limit(5)
    .populate("sender", "ad soyad rol")

  // 🔔 Okunmamışları tespit et ve okundu yap
  const okunmamislar = bildirimler.filter(b => !b.okundu).map(b => b._id);
  if (okunmamislar.length > 0) {
    await Notification.updateMany(
      { _id: { $in: okunmamislar } },
      { $set: { okundu: true } }
    );
  }

  // ✅ Geri bildirim mesajı (başarı, uyarı vs.)
  const mesaj = req.app.locals.mesaj || null;
  req.app.locals.mesaj = null;

  res.render("dashboard", {
    title: "Kontrol Paneli",
    user: req.user,
    bildirimler,
    mesaj
  });
};
