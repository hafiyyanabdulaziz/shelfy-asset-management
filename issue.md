# Issue: Migrasi Fitur Manajemen Aset dari Frontend Lama ke Frontend Baru

## Konteks
Kita telah membeli template frontend baru (Next.js dengan MUI) yang berada di folder `frontend-new`. Integrasi fitur login dan autentikasi dengan backend AdonisJS **sudah selesai dilakukan**.
Saat ini, kita perlu memigrasikan fitur-fitur manajemen aset utama yang sudah ada di folder `frontend` (React biasa) ke dalam arsitektur template baru di `frontend-new`.

## Tujuan
Memigrasikan fungsi CRUD (Create, Read, Update, Delete) untuk **Folders**, **Categories**, dan **Items** agar sesuai dengan desain dan standar kode pada template baru (`frontend-new`), serta terhubung dengan benar ke backend API.

## Referensi Kode Lama
Silakan jadikan komponen-komponen di folder `frontend/src/components` sebagai acuan logika bisnis dan request API:
- `FolderModal.js`
- `CategoryModal.js`
- `ItemCard.js`
- `ItemModal.js`
- `MainContent.js`
- `Sidebar.js`

## Detail Implementasi (Langkah-langkah)

### 1. Pahami Arsitektur Template Baru (`frontend-new`)
- Template baru menggunakan **Next.js App Router** (`src/app`).
- UI menggunakan komponen **Material UI (MUI)**.
- Autentikasi ditangani oleh **NextAuth**.
- Untuk mengambil data yang membutuhkan autentikasi (token JWT), ambil `accessToken` dari session pengguna.
- Struktur folder biasanya memisahkan **routing** (`src/app/[lang]/(dashboard)/(private)/apps/...`) dan **view components** (`src/views/apps/...`).

### 2. Implementasi Manajemen Folders
- Halaman route: `src/app/[lang]/(dashboard)/(private)/apps/folders/page.jsx` (Sebagian sudah dibuat, silakan lanjutkan).
- View component: `src/views/apps/folders/...`
- **Fitur yang dibutuhkan:**
  - Tampilkan daftar folder (fetch dari `GET /api/v1/folders`).
  - Tambah folder baru (Form/Modal untuk `POST /api/v1/folders`).
  - Edit folder (`PUT /api/v1/folders/:id`).
  - Hapus folder (`DELETE /api/v1/folders/:id`).

### 3. Implementasi Manajemen Categories
- Buat halaman route: `src/app/[lang]/(dashboard)/(private)/apps/categories/page.jsx`.
- Buat view component: `src/views/apps/categories/...`
- **Fitur yang dibutuhkan:**
  - Tampilkan daftar kategori (fetch dari `GET /api/v1/categories`).
  - Tambah kategori baru (`POST /api/v1/categories`).
  - Edit kategori (`PUT /api/v1/categories/:id`).
  - Hapus kategori (`DELETE /api/v1/categories/:id`).

### 4. Implementasi Manajemen Items
- Buat halaman route: `src/app/[lang]/(dashboard)/(private)/apps/items/page.jsx`.
- Buat view component: `src/views/apps/items/...`
- **Fitur yang dibutuhkan:**
  - Tampilkan daftar item (fetch dari `GET /api/v1/items`).
  - Tambah item baru beserta foto (`POST /api/v1/items`). Perhatikan cara _upload_ file/foto jika ada.
  - Edit detail item (`PUT /api/v1/items/:id`).
  - Hapus item (`DELETE /api/v1/items/:id`).
  - Hapus foto spesifik pada item (`DELETE /api/v1/item-photos/:id`).

### 5. Penyesuaian API Request
- Pastikan semua HTTP request (fetch/axios) menyertakan header `Authorization: Bearer <accessToken>`.
- `accessToken` bisa didapatkan dari session (misalnya dengan `useSession` di _client component_ atau `getServerSession(authOptions)` di _server component_).
- Base URL API harus menggunakan variabel `process.env.NEXT_PUBLIC_API_URL`.

## Panduan UI/UX
- Gunakan komponen bawaan MUI yang tersedia di template (misalnya `Table`, `Card`, `Dialog`/Modal, `TextField`, `Button`).
- Jangan buat _styling_ mentah dari awal jika ada komponen template yang bisa didaur ulang.
- Tampilkan notifikasi (misalnya Toast/Snackbar atau `Alert`) saat operasi berhasil atau gagal.

tolong lakukan testing dan pastikan tidak ada error.
