# Shelfy Asset Management

Shelfy Asset Management adalah aplikasi untuk mengelola aset barang. Project ini terdiri dari backend yang dibangun menggunakan **AdonisJS** dan frontend yang dibangun menggunakan **React**.

## Struktur Project

- `/backend`: AdonisJS API (SQLite)
- `/frontend`: React Application (MUI + Tailwind CSS)

---

## 🚀 Cara Instalasi

### 1. Persyaratan Sistem
Pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (Rekomendasi versi LTS)
- npm (Sudah termasuk saat menginstal Node.js)

### 2. Setup Backend

Masuk ke direktori backend:
```bash
cd backend
```

Instal dependensi:
```bash
npm install
```

Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Generate App Key:
```bash
node ace generate:key
```

Jalankan Migrasi Database (SQLite):
```bash
node ace migration:run
```

Jalankan Server Backend:
```bash
npm run dev
```
Backend akan berjalan di `http://localhost:3333`.

---

### 3. Setup Frontend

Buka terminal baru dan masuk ke direktori frontend:
```bash
cd frontend
```

Instal dependensi:
```bash
npm install
```

Jalankan Aplikasi Frontend:
```bash
npm start
```
Frontend akan berjalan di `http://localhost:3000`.

---

## 🏗️ Build untuk Produksi

Sebelum menjalankan aplikasi dalam mode produksi, Anda harus melakukan build pada frontend dan backend untuk performa maksimal.

### 1. Build Backend (AdonisJS)
```bash
cd backend
node ace build
```
Hasil build akan berada di folder `backend/build`. 
> [!IMPORTANT]
> Pastikan file `.env` sudah dikonfigurasi dengan benar di dalam folder `backend/build`.

### 2. Build Frontend (Next.js)
```bash
cd frontend
yarn build
# atau
npm run build
```

---

## 🚀 Menjalankan Mode Produksi (PM2)

Gunakan **PM2** untuk menjalankan aplikasi di background secara terus-menerus.

### 1. Instal PM2 secara Global
Jika Anda belum menginstalnya, jalankan:
```bash
npm install -g pm2
```

### 2. Jalankan dengan File Konfigurasi
Dari direktori **root** proyek (tempat file `ecosystem.config.cjs` berada), jalankan:
```bash
pm2 start ecosystem.config.cjs
```

### 3. Manajemen Proses PM2
- **Cek Status**: `pm2 status`
- **Cek Log**: `pm2 logs`
- **Hentikan Aplikasi**: `pm2 stop ecosystem.config.cjs`
- **Hapus dari PM2**: `pm2 delete all`

---

## 📝 Catatan Penting
- Pastikan backend sudah di-build sebelum menjalankan PM2 karena konfigurasi mengarah ke folder `backend/build`.
- Database menggunakan SQLite (`db.sqlite3`).
- Jika Anda mengubah port, pastikan sesuaikan di file `.env` dan `ecosystem.config.cjs`.
