# Issue: Integrasi Login Frontend Baru dengan Backend AdonisJS

## Deskripsi
Kita telah menambahkan template frontend baru di folder `frontend-new` (berbasis Next.js). Saat ini, fitur login di template tersebut masih menggunakan konfigurasi bawaan (dummy credentials dan koneksi database langsung via Prisma). Tugas ini bertujuan untuk mengintegrasikan fitur login NextAuth di frontend baru dengan API autentikasi backend AdonisJS yang sudah ada.

## Tujuan
- Menghubungkan proses autentikasi (NextAuth) di `frontend-new` ke endpoint `POST /api/v1/auth/login` pada backend AdonisJS.
- Menghapus koneksi database langsung (Prisma) dari frontend karena manajemen data ditangani sepenuhnya oleh backend.
- Menyimpan JWT token yang dikembalikan oleh backend ke dalam session NextAuth agar dapat digunakan untuk request API selanjutnya yang membutuhkan autentikasi.

## Detail Implementasi (Langkah-langkah)

### 1. Penyesuaian Environment Variables (`frontend-new/.env`)
- Ubah value `API_URL` agar mengarah ke base URL backend AdonisJS (default AdonisJS berjalan di port 3333 dan memiliki prefix `/api/v1`).
  ```env
  API_URL=http://localhost:3333/api/v1
  ```
- Pastikan variabel `NEXT_PUBLIC_API_URL` juga sinkron dengan backend.

### 2. Modifikasi File Konfigurasi NextAuth (`frontend-new/src/libs/auth.js`)
File ini adalah inti dari perubahan. Lakukan penyesuaian berikut:

**A. Hapus Prisma Adapter**
Backend AdonisJS akan mengelola database, sehingga frontend tidak perlu Prisma.
- Hapus import `PrismaAdapter` dan `PrismaClient`.
- Hapus inisialisasi `const prisma = new PrismaClient()`.
- Hapus opsi `adapter: PrismaAdapter(prisma)` dari object `authOptions`.

**B. Update Logika `authorize` pada `CredentialProvider`**
- Ubah endpoint API pada fungsi `fetch` dari `${process.env.API_URL}/login` menjadi `${process.env.API_URL}/auth/login` (sesuai struktur route backend).
- Backend AdonisJS mengharapkan request body `{ email, password }`. Struktur ini sudah sesuai.
- Tangkap response dari backend. Berdasarkan `access_token_controller.ts` backend, jika berhasil response akan berbentuk:
  ```json
  {
    "user": { ...data user... },
    "token": "..."
  }
  ```
- Jika request sukses (`res.status === 200`), kembalikan object gabungan yang berisi informasi user dan token, misalnya: 
  ```javascript
  return { ...data.user, accessToken: data.token }
  ```

**C. Update Callbacks (`jwt` dan `session`)**
Agar token AdonisJS dapat diakses di sisi client untuk request API (seperti get profile, dsb), token perlu diteruskan melalui JWT NextAuth.
- **`jwt` callback:**
  ```javascript
  async jwt({ token, user }) {
    if (user) {
      token.accessToken = user.accessToken; // Simpan token dari backend
      token.user = user; // Simpan data profile user
    }
    return token;
  }
  ```
- **`session` callback:**
  ```javascript
  async session({ session, token }) {
    if (token.user) {
      session.user = token.user;
      session.accessToken = token.accessToken;
    }
    return session;
  }
  ```

### 3. Cleanup Kode (Opsional tapi Direkomendasikan)
- **Hapus Dependensi Prisma**: Hapus `@prisma/client` dan `@auth/prisma-adapter` dari `frontend-new/package.json` dan jalankan ulang `npm install` atau hapus folder `prisma` jika ada.
- **Penyesuaian Tampilan (`frontend-new/src/views/Login.jsx`)**:
  - Hapus nilai bawaan (`defaultValues`) `admin@vuexy.com` & `admin` dari konfigurasi `useForm` agar user mengisi secara manual.
  - Hapus atau ubah `<Alert>` yang menampilkan informasi akun bawaan template.

## Referensi File
- **Backend Route**: `backend/start/routes.ts` (melihat endpoint)
- **Backend Controller**: `backend/app/controllers/access_token_controller.ts` (melihat format response login)
- **Frontend Auth Config**: `frontend-new/src/libs/auth.js`
- **Frontend Env**: `frontend-new/.env`
- **Frontend Login View**: `frontend-new/src/views/Login.jsx`

## Pengujian & Validasi (Testing)
Pastikan hal-hal berikut berjalan lancar setelah implementasi selesai:
1. **Login Berhasil**: Cobalah login menggunakan email dan password yang valid (terdaftar di database backend). Pastikan user ter-redirect ke dashboard/halaman utama setelah berhasil login.
2. **Penanganan Error Validasi**: Coba login dengan kredensial yang salah. Pastikan UI menampilkan pesan error yang sesuai (misalnya "Invalid credentials") tanpa aplikasi mengalami _crash_.
3. **Session Terjaga**: Setelah berhasil login, _refresh_ halaman (F5). Pastikan sesi user tidak hilang dan halaman tidak melempar kembali ke form login.
4. **Token Tersedia**: Lakukan `console.log` sementara pada session di client-side (atau periksa payload session) untuk memastikan field `accessToken` sudah ada dan menyimpan nilai token yang benar dari backend.
5. **Tidak Ada Error di Console**: Buka developer tools browser (F12) dan console terminal yang menjalankan `npm run dev` pada `frontend-new`. Pastikan bersih dari error _Unhandled Promise Rejection_ atau error koneksi database Prisma.
