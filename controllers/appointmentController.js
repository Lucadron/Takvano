const Appointment = require("../models/Appointment");
const User = require("../models/User");
const sendMail = require("../utils/sendMail");
//Organizatör Bildirim
const notify = require("../utils/notify");

// Ziyaretçi: Randevu talep formu (GET)
exports.newAppointmentForm = async (req, res) => {
  const organizatorId = req.params.id;
  const organizator = await User.findById(organizatorId);
  if (!organizator || organizator.rol !== "Organizator") {
    return res.redirect("/");
  }

  const generateSlots = () => {
    const slots = [];
    const startHour = 8;
    const endHour = 17;
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`);
      slots.push(`${hour.toString().padStart(2, "0")}:30`);
    }
    return slots;
  };

  const randevular = await Appointment.find({
    organizator: organizatorId,
    durum: "Kabul Edildi"
  });

  const slotMap = {};
  randevular.forEach((r) => {
    const date = new Date(r.tarih);
    const key = date.toISOString().split("T")[0]; // yyyy-mm-dd
    const time = date.toTimeString().slice(0, 5); // HH:MM
    if (!slotMap[key]) slotMap[key] = {};
    slotMap[key][time] = true;
  });

  res.render("appointments/new", {
    title: "Randevu Talep Et",
    organizator,
    slotMap: JSON.stringify(slotMap), // client tarafında kullanacağız
    slotList: generateSlots()
  });
};

// Organizator: Gelen talepleri gör
exports.viewRequests = async (req, res) => {
  const now = new Date();

  const aktif = await Appointment.find({
    organizator: req.user.id,
    tarih: { $gte: now }
  }).populate("ziyaretci", "ad soyad profilFoto").sort({ tarih: 1 });

  const gecmis = await Appointment.find({
    organizator: req.user.id,
    tarih: { $lt: now }
  }).populate("ziyaretci", "ad soyad profilFoto").sort({ tarih: -1 });

  res.render("appointments/inbox", {
    title: "Gelen Randevu Talepleri",
    aktif,
    gecmis
  });
};

// Organizator: Talebi kabul/ret et
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { durum } = req.body;

  if (!["Kabul Edildi", "Reddedildi"].includes(durum)) {
    return res.redirect("/randevular");
  }

  await Appointment.findByIdAndUpdate(id, { durum });
  res.redirect("/randevular");
};

//Organizatör takvim
const generateSlots = () => {
  const slots = [];
  const startHour = 8;
  const endHour = 17;
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`);
    slots.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return slots;
};

//Organizatör takvim
exports.organizatorCalendar = async (req, res) => {
  const organizatorId = req.params.id;
  const organizator = await User.findById(organizatorId);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Sadece bugünden sonraki randevular
  const randevular = await Appointment.find({
    organizator: organizatorId,
    durum: "Kabul Edildi",
    tarih: { $gte: today }
  });

  const slotMap = {};

  randevular.forEach((r) => {
    const date = new Date(r.tarih);
    const key = date.toLocaleDateString("tr-TR");
    const time = date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    if (!slotMap[key]) slotMap[key] = {};
    slotMap[key][time] = true; // dolu
  });

  res.render("appointments/calendar", {
    title: "Takvim",
    organizator,
    slotMap,
    slotList: generateSlots()
  });
};

//Randevu sayfası
exports.myAppointments = async (req, res) => {
  const now = new Date();

  const aktifRandevular = await Appointment.find({
    ziyaretci: req.user.id,
    tarih: { $gte: now }
  }).populate("organizator", "ad soyad email profilFoto").sort({ tarih: 1 });

  const gecmisRandevular = await Appointment.find({
    ziyaretci: req.user.id,
    tarih: { $lt: now }
  }).populate("organizator", "ad soyad email profilFoto").sort({ tarih: -1 });

  // Geçmişte kalan "Bekliyor" randevular varsa "Zaman Aşımı" yap
  await Appointment.updateMany(
    { ziyaretci: req.user.id, durum: "Bekliyor", tarih: { $lt: now } },
    { $set: { durum: "Zaman Aşımı" } }
  );
  res.render("appointments/my", {
    title: "Randevularım",
    aktifRandevular,
    gecmisRandevular,
    mesaj: req.app.locals.mesaj || null
  });

  req.app.locals.mesaj = null;
};

exports.createAppointment = async (req, res) => {
  try {
    const { aciklama, tarihSecimi, saat } = req.body;
    const organizatorId = req.params.id;
    const ziyaretciId = req.user.id;

    const fullDate = new Date(`${tarihSecimi}T${saat}`);
    const now = new Date();

    // ❗ Kritik kontrol – geçmiş saat kontrolü
    if (fullDate < now) {
      req.app.locals.mesaj = "Geçmiş bir saate randevu alınamaz.";
      return res.redirect(`/randevu-talep/${req.params.id}`);
    }

    const organizator = await User.findById(organizatorId);

    const yeni = new Appointment({
      organizator: organizatorId,
      ziyaretci: ziyaretciId,
      tarih: fullDate,
      aciklama
    });

    await yeni.save();

    await sendMail(
      organizator.email,
      "Yeni Randevu Talebi",
      `${req.user.ad} ${req.user.soyad} size ${fullDate.toLocaleString("tr-TR")} için bir randevu talebinde bulundu.`
    );

    await notify(
      organizatorId,
      `📬 Yeni randevu talebi alındı\n📅 Randevu Zamanı: ${fullDate.toLocaleString("tr-TR")}\n📥 Talep Zamanı: ${now.toLocaleString("tr-TR")}`,
      ziyaretciId
    );

    // ✅ Başarı mesajı
    req.app.locals.mesaj = "✅ Randevu talebiniz başarıyla gönderildi.";
    res.redirect("/dashboard");

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Randevu oluşturma hatası:", err);
    res.redirect("/");
  }
};

//Randevu İptal
exports.cancelAppointment = async (req, res) => {
  const randevu = await Appointment.findById(req.params.id);

  // Randevu yoksa ya da randevunun sahibi değilse engelle
  if (!randevu || randevu.ziyaretci.toString() !== req.user.id) {
    req.app.locals.mesaj = "Bu randevuyu iptal edemezsiniz.";
    return res.redirect("/randevularim");
  }

  await Appointment.findByIdAndDelete(req.params.id);

  req.app.locals.mesaj = "❌ Randevunuz başarıyla iptal edildi.";
  res.redirect("/randevularim");
};

//Ziyaretçi Bildirim
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { durum } = req.body;

  if (!["Kabul Edildi", "Reddedildi"].includes(durum)) {
    return res.redirect("/randevular");
  }

  const randevu = await Appointment.findById(id).populate("ziyaretci");
  randevu.durum = durum;
  await randevu.save();
  await sendMail(
    randevu.ziyaretci.email,
    `Randevunuz ${durum}`,
    `Randevunuz ${durum.toLowerCase()} (${randevu.tarih.toLocaleString("tr-TR")})`
  );

  const mesaj = durum === "Kabul Edildi"
    ? `Randevunuz kabul edildi: ${randevu.tarih.toLocaleString("tr-TR")}`
    : `Randevunuz reddedildi: ${randevu.tarih.toLocaleString("tr-TR")}`;

  await notify(
    randevu.ziyaretci._id,  // bildirimi alacak kişi (ziyaretçi)
    mesaj,
    req.user.id             // bildirimi gönderen kişi (organizator)
  );

  res.redirect("/randevular");
};

