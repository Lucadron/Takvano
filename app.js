const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const jwt = require("jsonwebtoken");

// .env dosyasını yükle
dotenv.config();

// Express uygulaması oluştur
const app = express();

// Middleware'ler
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);
//Eksik değişkenlere global atama
app.use((req, res, next) => {
  res.locals.title = "Takvano";
/*   res.locals.user = req.user || null;
  res.locals.mesaj = req.app.locals.mesaj || null;
  req.app.locals.mesaj = null;
 */  next();
});

// DEV LOG MIDDLEWARE - Eksik render verilerini geliştiriciye bildir
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    const originalRender = res.render;
    res.render = function (view, options = {}, callback) {
      const eksikler = [];

      // Hangi değişkenleri zorunlu görmek istiyorsan buraya ekle
      if (!options.title) eksikler.push("title");
      if (!options.user) eksikler.push("user");
      if (view.includes("dashboard") && !options.bildirimler) eksikler.push("bildirimler");
      if (view.includes("my") && !options.aktifRandevular) eksikler.push("aktifRandevular");

      if (eksikler.length > 0) {
        console.warn(`⚠️ Uyarı: '${view}.ejs' dosyasına eksik render değişken(ler)i gönderilmiş: [ ${eksikler.join(", ")} ]`);
      }

      return originalRender.call(this, view, options, callback);
    };
    next();
  });
}

// EJS ayarları
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layout");

// Kullanıcı bilgisini tüm EJS dosyalarına gönder
app.use((req, res, next) => {
  const token = req.cookies.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.user = decoded;
      req.user = decoded;
    } catch (err) {
      res.locals.user = null;
    }
  } else {
    res.locals.user = null;
  }
  next();
});

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("❌ MongoDB bağlantı hatası:", err));

// ROUTES
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");
const appointmentRoutes = require("./routes/appointment");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const notificationRoutes = require("./routes/notification"); // ✅

app.use("/bildirimler", notificationRoutes); // 📬 net adres
app.use("/", authRoutes);
app.use("/", profileRoutes);
app.use("/", appointmentRoutes);
app.use("/", userRoutes);
app.use("/", adminRoutes);

// Anasayfa
app.get("/", (req, res) => {
  res.render("index", { title: "Anasayfa" });
});

// Sunucuyu başlat
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor...`);
});
