# 🗓 Takvano

Takvano, organizatör ve ziyaretçi arasında randevu talebi, takvim görüntüleme, kullanıcı yönetimi ve bildirim mekanizmaları sağlayan Node.js tabanlı bir web uygulamasıdır.

---

## 🚀 Özellikler

- 🔐 JWT tabanlı giriş sistemi (Cookie ile oturum kontrolü)
- 📆 Takvim üzerinden saat seçimi (dolu/boş saat görünümü)
- 🧑‍💻 Rol tabanlı yetkilendirme: Admin, Organizator, Ziyaretçi
- 📥 Randevu talebi, organizatör tarafından onay/ret mekanizması
- ⭐ Favori organizatör listesi
- 🔔 Sistem içi bildirim + e-posta gönderimi
- 📤 Profil resmi yükleme ve düzenleme
- 🛠 Admin paneli: kullanıcı ve randevu kontrolü

---

## 🛠 Kurulum

```bash
git clone https://github.com/Lucadron/Takvano.git
cd Takvano
npm install
```
---

## 📁 Ortam Değişkeni Tanımı
.env.example dosyasına göre .env dosyanı kendin oluşturmalısın:
PORT=8002
MONGO_URI=mongodb://localhost/takvano
JWT_SECRET=senin_secret_keyin
EMAIL_USER=senin_emailin
EMAIL_PASS=uygulama_sifren

--- 

## ▶️ Çalıştırma (http://localhost:8002)
```
npm start
```

---

## 👤 Roller ve Yetkiler
| Rol         | Yetkiler                                                |
| ----------- | ------------------------------------------------------- |
| Admin       | Tüm kullanıcıları/randevuları görüntüleme ve silme      |
| Organizator | Randevu alma, takvim kontrolü, gelen talepleri onaylama |
| Ziyaretçi   | Randevu oluşturma, favori ekleme, profil düzenleme      |

---

## 📫 İletişim
Email: emregulsentr0@gmail.com
LinkedIn: https://www.linkedin.com/in/emregulsen/
