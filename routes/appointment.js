const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const appointmentController = require("../controllers/appointmentController");

// Ziyaretçi: Randevu talep formunu gör
router.get("/randevu-talep/:id", auth, appointmentController.newAppointmentForm);

// Ziyaretçi: Randevu talebini gönder
router.post("/randevu-talep/:id", auth, appointmentController.createAppointment);

// Organizator: Gelen randevu taleplerini görüntüle
router.get("/randevular", auth, appointmentController.viewRequests);

// Organizator: Randevu kabul/ret işlemi
router.post("/randevu-guncelle/:id", auth, appointmentController.updateStatus);

// Organizator: takvim
router.get("/takvim/:id", auth, appointmentController.organizatorCalendar);

//Randevu
router.get("/randevularim", auth, appointmentController.myAppointments);

//Randevu İPTAL
router.post("/randevu-iptal/:id", auth, appointmentController.cancelAppointment);


module.exports = router;
