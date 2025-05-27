const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  organizator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ziyaretci: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tarih: { type: Date, required: true },
  aciklama: { type: String, required: true },
  durum: {
    type: String,
    enum: ["Bekliyor", "Kabul Edildi", "Reddedildi", "Zaman Aşımı"],
    default: "Bekliyor"
  },
  olusturmaTarihi: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", appointmentSchema);
