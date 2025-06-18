const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  soyad: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sifre: { type: String, required: true },
  rol: {
    type: String,
    enum: ["Ziyaretci", "Organizator", "Admin"],
    default: "Ziyaretci"
  },
  profilFoto: { type: String, default: "/uploads/ppbos.jpg" },
  motto: { type: String, default: "" },
  favoriler: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  aktif: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  calismaSaatleri: {
    baslangic: { type: String, default: "08:00" },
    bitis: { type: String, default: "17:00" }
  }
});

// Şifreyi kaydetmeden önce hashle
userSchema.pre("save", async function (next) {
  if (!this.isModified("sifre")) return next();
  try {
    const hashed = await bcrypt.hash(this.sifre, 10);
    this.sifre = hashed;
    next();
  } catch (err) {
    return next(err);
  }
});



module.exports = mongoose.model("User", userSchema);
