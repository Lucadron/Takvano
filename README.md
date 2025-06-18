# 🔷 Takvano V2 – Akıllı Randevu Yönetim Sistemi

Takvano, ziyaretçilerin organizatörlerden randevu talep edebildiği, organizatörlerin randevuları yönetebildiği, dinamik bildirim sistemine ve şık kullanıcı paneline sahip modern bir web uygulamasıdır.

---

## 🚀 Özellikler

- 👤 Rol Bazlı Giriş Sistemi (Ziyaretçi / Organizator / Admin)
- 📅 Akıllı Randevu Takvimi ve Çakışma Engelleme
- 🔔 Okunabilir / filtrelenebilir / toplu okundu yapılabilir dinamik bildirim paneli
- ✉️ E-posta ile bilgilendirme (NodeMailer)
- 👁 Profil görüntüleme & güncelleme (fotoğraflı, 4 MB sınır, önizleme desteği)
- ✅ Randevu onay / red / iptal işlemleri
- 📦 Dosya yükleme (profil fotoğrafı) – `uploads/` klasörü
- 📂 Upload kontrol aracı (admin panelde dosya listeleme + tekli/çoklu silme)
- 🗂 Dosya boyutu sınırı ve sıkıştırma (Sharp ile max 300x300 jpeg, kalite: 80)
- 📱 Mobil uyumlu arayüz (Bootstrap 5.3)

---

## 🛠 Kurulum Adımları

```bash
# 1. Projeyi klonla
git clone https://github.com/lucadron/takvano.git
cd takvano

# 2. Gerekli bağımlılıkları yükle
npm install

# 3. .env dosyasını oluştur
cp .env.example .env

# 4. Geliştirme sunucusunu başlat
npm run dev
```

---

## 🧪 .env Dosya Yapısı

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/takvano
JWT_SECRET=çokgizlisifre

EMAIL_USER=youremail@gmail.com
EMAIL_PASS=uygulama_sifresi
```
> 💡 Gmail kullanıyorsan: İki adımlı doğrulama aktifse [App Passwords](https://myaccount.google.com/apppasswords) üzerinden `EMAIL_PASS` üretmelisin.

---

## 📁 Proje Yapısı

```text
Takvano/
├── models/
├── routes/
├── controllers/
├── views/
│   ├── profile/
│   ├── admin/
│   └── notifications/
├── utils/
├── public/
│   ├── uploads/         # Kullanıcı fotoğrafları (ignored)
│   ├── js/
│   └── scripts/
├── .gitignore
├── .env
├── server.js
└── README.md
```

---

## ✨ Teşekkürler

> Bu proje bir eğitim ve geliştirme projesidir.
