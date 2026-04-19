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

## 🛠️ Ringkasan Perintah Penting

### Backend (AdonisJS)
- `npm run dev`: Menjalankan server dalam mode development (HMR).
- `node ace migration:run`: Menjalankan migrasi database.
- `node ace migration:rollback`: Membatalkan migrasi terakhir.
- `node ace make:controller [Nama]`: Membuat controller baru.
- `node ace make:model [Nama] -m`: Membuat model beserta migrasinya.

### Frontend (React)
- `npm start`: Menjalankan aplikasi React.
- `npm run build`: Membuat build produksi.

---

## 📝 Catatan Penting
- Pastikan backend berjalan sebelum membuka frontend agar API dapat diakses.
- Database menggunakan SQLite yang disimpan di folder `backend/tmp/db.sqlite3`.
- Jika Anda ingin mengubah port, silakan sesuaikan di file `.env` (backend) dan `frontend/src/api/api.js`.
