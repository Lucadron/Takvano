const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  mesaj: { type: String, required: true },
  tarih: { type: Date, default: Date.now },
  okundu: { type: Boolean, default: false }
});

module.exports = mongoose.model("Notification", notificationSchema);
