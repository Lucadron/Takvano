const Notification = require("../models/Notification");

async function notify(userId, mesaj) {
  await Notification.create({
    user: userId,
    mesaj
  });
}

module.exports = notify;
