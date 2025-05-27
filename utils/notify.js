const Notification = require("../models/Notification");

//Bildirim fonksiyonu
async function notify(userId, mesaj, senderId = null) {
  await Notification.create({
    user: userId,
    mesaj,
    sender: senderId,
    okundu: false
  });
}

module.exports = notify;
