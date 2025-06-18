const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const adminController = require("../controllers/adminController");
const { upload, uploadSharp } = require("../middleware/upload");
const fs = require("fs");
const path = require("path");

router.get("/admin", auth, isAdmin, adminController.panel);
router.post("/admin/kullanici-sil/:id", auth, isAdmin, adminController.silKullanici);
router.post("/admin/randevu-sil/:id", auth, isAdmin, adminController.silRandevu);
router.get("/admin/kullanici-duzenle/:id", auth, isAdmin, adminController.kullaniciGetir);

router.post("/admin/kullanici-duzenle/:id", auth, isAdmin, (req, res, next) => {
  upload.single("profilFoto")(req, res, function (err) {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return adminController.renderError(req, res, req.params.id, "❌ Dosya boyutu 4 MB'den küçük olmalı.");
      } else if (err.message) {
        return adminController.renderError(req, res, req.params.id, err.message);
      } else {
        return adminController.renderError(req, res, req.params.id, "❌ Bir hata oluştu.");
      }
    }
    next();
  });
}, uploadSharp, adminController.kullaniciGuncelle);

router.get("/admin/uploads", auth, isAdmin, (req, res) => {
  const uploadPath = path.join(__dirname, "..", "public", "uploads");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      console.error("Upload klasörü okunamadı:", err);
      return res.render("admin/uploads", { files: [], hata: "Klasör okunamadı.", basari: null });
    }

    const fileList = files.map(filename => {
      const stats = fs.statSync(path.join(uploadPath, filename));
      return {
        name: filename,
        sizeKB: (stats.size / 1024).toFixed(2)
      };
    });

    res.render("admin/uploads", {
      title: "Uploads Yönetimi",
      user: req.user,   // user gönderiliyor
      files: fileList,
      hata: null,
      basari: null
    });
  });
});

// Tek dosya sil
router.post("/admin/uploads/sil/:filename", auth, isAdmin, (req, res) => {
  const filePath = path.join(__dirname, "..", "public", "uploads", req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Dosya silinemedi:", err);
      return res.redirect("/admin/uploads");
    }
    console.log("✅ Silindi:", req.params.filename);
    
    res.redirect("/admin/uploads");
    
  });
});

// Tüm dosyaları sil
router.post("/admin/uploads/tumunu-sil", auth, isAdmin, (req, res) => {
  const uploadPath = path.join(__dirname, "..", "public", "uploads");
  fs.readdir(uploadPath, (err, files) => {
    if (err) {
      console.error("Upload klasörü okunamadı:", err);
      return res.redirect("/admin/uploads");
    }

    files.forEach(filename => {
      const filePath = path.join(uploadPath, filename);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.warn("Bazı dosyalar silinemedi:", err.message);
        }
      });
    });

    console.log("✅ Tüm dosyalar silindi");
    res.redirect("/admin/uploads");
  });
});

module.exports = router;
