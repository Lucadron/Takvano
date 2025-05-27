const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

// GET: Kayıt ve Giriş Sayfaları
router.get("/kayit", authController.registerGet);
router.get("/giris", authController.loginGet);
router.get("/cikis", authController.logout);

// POST: Kayıt ve Giriş İşlemleri
router.post("/kayit", authController.registerPost);
router.post("/giris", authController.loginPost);

// GET: Dashboard
router.get("/dashboard", authMiddleware, authController.dashboard);

module.exports = router;
