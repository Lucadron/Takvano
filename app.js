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
