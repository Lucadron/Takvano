const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const userController = require("../controllers/userController");

// Ziyaretçi: Organizator listesi
router.get("/organizatorler", auth, userController.listOrganizators);

//Organizator detay
router.get("/organizator/:id", auth, userController.organizatorDetail);

//Arama APIsi
router.get("/api/organizator-ara", auth, async (req, res) => {
    const q = req.query.q;
    if (!q) return res.json([]);
  
    const sonuc = await require("../models/User").find({
      rol: "Organizator",
      $or: [
        { ad: { $regex: q, $options: "i" } },
        { soyad: { $regex: q, $options: "i" } }
      ]
    }).limit(10);
  
    res.json(sonuc);
  });
  
//Favori işlemleri
router.get("/favorilerim", auth, userController.getFavorites);
router.post("/favori/:id", auth, userController.toggleFavorite);

router.get("/change-password", auth, userController.getChangePassword);
router.post("/change-password", auth, userController.postChangePassword);

router.get("/ziyaretci/:id", auth, userController.viewVisitorProfile);


module.exports = router;
