# Issue: Konfigurasi Environment Variables (.env) untuk Frontend dan Backend

## Deskripsi
Tugas ini bertujuan untuk menambahkan pengaturan konfigurasi melalui file `.env` di kedua sisi (Frontend dan Backend). Tujuannya agar aplikasi dapat dengan mudah diatur untuk lingkungan produksi (production) atau dipindahkan ke server lain tanpa harus mengubah (hardcode) kode sumber aplikasi.

## 📝 Tasks Frontend (Create React App)
1. **Buat file `.env` dan `.env.example`** di dalam folder `frontend/`.
2. **Tambahkan Konfigurasi URL Backend:**
   - Tambahkan variabel `REACT_APP_API_URL` (karena menggunakan React Scripts / CRA, variabel wajib memiliki prefix `REACT_APP_`).
   - Contoh isi: `REACT_APP_API_URL=http://localhost:3333`
3. **Tambahkan Konfigurasi Produksi Lainnya:**
   - Tambahkan variabel tambahan yang dibutuhkan saat *deployment*.
   - Contoh: `PORT=3000` (untuk mengubah port React jika diperlukan), `REACT_APP_ENV=production`.
4. **Update Kode Frontend:**
   - Cari seluruh kode yang melakukan HTTP Request (misalnya menggunakan `axios` atau `fetch`) ke URL backend yang masih di-hardcode.
   - Ganti *base URL* tersebut menggunakan `process.env.REACT_APP_API_URL`.

## 📝 Tasks Backend (AdonisJS & SQLite)
1. **Perbarui file `.env` dan `.env.example`** di dalam folder `backend/`.
2. **Tambahkan Konfigurasi Lokasi Database:**
   - Karena backend menggunakan SQLite (`better-sqlite3`), tambahkan variabel untuk menentukan lokasi file `.sqlite`.
   - Tambahkan variabel `DB_DATABASE` (atau `DB_PATH`).
   - Contoh isi: `DB_DATABASE=C:/jalur/absolut/ke/database.sqlite` (untuk fleksibilitas pemindahan database).
3. **Update Konfigurasi Database Backend:**
   - Buka file konfigurasi database di AdonisJS (biasanya di `config/database.ts`).
   - Pastikan koneksi untuk SQLite dikonfigurasi agar mengambil nilai dari environment, contoh: `connection: { filename: env.get('DB_DATABASE', app.tmpPath('db.sqlite3')) }`.
4. **Tambahkan Konfigurasi Produksi Lainnya:**
   - Pastikan variabel penting seperti `NODE_ENV`, `APP_URL`, `CORS_ORIGIN`, `PORT`, `HOST`, dan `APP_KEY` sudah terdaftar secara jelas di `.env` dan `.env.example`.

## ✅ Kriteria Penerimaan (Acceptance Criteria)
- [ ] Terdapat file `.env.example` di dalam folder `frontend/` berisi struktur variabel yang dibutuhkan.
- [ ] Semua request ke API di frontend sudah memakai `process.env.REACT_APP_API_URL`, tidak ada lagi *hardcode* domain backend.
- [ ] Terdapat konfigurasi `DB_DATABASE` di dalam file `.env.example` backend.
- [ ] File database `.sqlite` dapat dipindahkan ke folder di luar *project*, dan backend tetap bisa terhubung hanya dengan mengganti path di file `.env`.
- [ ] Proses *build* dan *run* berjalan normal tanpa error terkait environment variables.
