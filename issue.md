# Issue: Migrasi Penyimpanan Foto dari Local Filesystem ke MinIO Object Storage

## Konteks

Saat ini, backend AdonisJS menyimpan file foto item di folder `public/uploads/` pada server lokal.
Foto diakses melalui static file serving AdonisJS (`@adonisjs/static`).

Pendekatan ini memiliki beberapa kelemahan:
- File hilang saat re-deploy atau pindah server
- Tidak scalable untuk multi-instance deployment
- Tidak ada CDN/caching layer
- Bergantung pada disk space server

Kita akan memigrasikan penyimpanan foto ke **MinIO** (S3-compatible object storage) yang sudah tersedia di server.

## Tujuan

Mengubah mekanisme upload dan penyimpanan foto dari lokal filesystem (`public/uploads/`) ke MinIO object storage, sehingga:
1. Foto disimpan di MinIO bucket `shefly-password`
2. Foto diakses via presigned URL atau public URL dari MinIO
3. Operasi hapus foto juga menghapus file dari MinIO
4. Database `item_photos.photoUrl` menyimpan key/path MinIO, bukan path lokal

## Prasyarat

### ✅ Sudah Selesai
- [x] Package `minio` sudah terinstall di backend (`npm install minio`)
- [x] Environment variables MinIO sudah ditambahkan ke `.env` dan `.env.example`
- [x] Validasi env vars sudah ditambahkan di `start/env.ts`
- [x] Bucket `shefly-password` sudah dibuat di MinIO server
- [x] Koneksi ke MinIO sudah diverifikasi dan berfungsi

### Environment Variables (sudah ada di `.env`)
```env
MINIO_ENDPOINT=server.hafiyyanabdulaziz.my.id
MINIO_PORT=9002
MINIO_ACCESS_KEY=hafiyyanabdulaziz
MINIO_SECRET_KEY=MICROSOFTsaya1!
MINIO_USE_SSL=false
MINIO_BUCKET=shefly-password
```

## Detail Implementasi (Step-by-Step)

### Step 1: Buat MinIO Service (`app/services/minio_service.ts`)

Buat file service baru yang mengenkapsulasi semua interaksi dengan MinIO.

**File:** `backend/app/services/minio_service.ts`

```typescript
import * as Minio from 'minio'
import env from '#start/env'
import { randomUUID } from 'node:crypto'

class MinioService {
  private client: Minio.Client
  private bucket: string

  constructor() {
    this.client = new Minio.Client({
      endPoint: env.get('MINIO_ENDPOINT'),
      port: env.get('MINIO_PORT'),
      useSSL: env.get('MINIO_USE_SSL'),
      accessKey: env.get('MINIO_ACCESS_KEY'),
      secretKey: env.get('MINIO_SECRET_KEY'),
    })
    this.bucket = env.get('MINIO_BUCKET')
  }

  /**
   * Upload file ke MinIO
   * @param fileBuffer - Buffer dari file yang diupload
   * @param originalName - Nama file asli (untuk mendapatkan extension)
   * @param contentType - MIME type file (contoh: 'image/jpeg')
   * @returns Object key (path) file di MinIO
   */
  async uploadFile(fileBuffer: Buffer, originalName: string, contentType: string): Promise<string> {
    const ext = originalName.split('.').pop()
    const objectKey = `uploads/${randomUUID()}.${ext}`

    await this.client.putObject(this.bucket, objectKey, fileBuffer, fileBuffer.length, {
      'Content-Type': contentType,
    })

    return objectKey
  }

  /**
   * Generate presigned URL untuk mengakses file
   * @param objectKey - Key/path file di MinIO
   * @param expirySeconds - Waktu kedaluwarsa URL (default: 7 hari)
   * @returns Presigned URL
   */
  async getPresignedUrl(objectKey: string, expirySeconds: number = 7 * 24 * 60 * 60): Promise<string> {
    return await this.client.presignedGetObject(this.bucket, objectKey, expirySeconds)
  }

  /**
   * Hapus file dari MinIO
   * @param objectKey - Key/path file di MinIO
   */
  async deleteFile(objectKey: string): Promise<void> {
    await this.client.removeObject(this.bucket, objectKey)
  }

  /**
   * Cek apakah file ada di MinIO
   * @param objectKey - Key/path file di MinIO
   */
  async fileExists(objectKey: string): Promise<boolean> {
    try {
      await this.client.statObject(this.bucket, objectKey)
      return true
    } catch {
      return false
    }
  }
}

export default new MinioService()
```

**Penjelasan:**
- Service ini di-export sebagai singleton instance
- `uploadFile()` meng-generate unique filename dengan UUID untuk menghindari collision
- `getPresignedUrl()` membuat URL sementara yang bisa diakses untuk melihat foto
- File disimpan dengan prefix `uploads/` di dalam bucket

---

### Step 2: Ubah `items_controller.ts` — Method `store()`

**File:** `backend/app/controllers/items_controller.ts`

**Perubahan yang perlu dilakukan:**

1. Hapus import `app` dari `@adonisjs/core/services/app` (tidak diperlukan lagi)
2. Hapus import `randomUUID` (sudah ditangani di MinioService)
3. Tambah import `MinioService`
4. Ubah logika upload foto dari `photo.move()` ke `MinioService.uploadFile()`

**Kode SEBELUM (baris 52-61):**
```typescript
for (const photo of photos) {
  if (photo.isValid) {
    await photo.move(app.publicPath('uploads'), {
      name: `${randomUUID()}.${photo.extname}`,
    })
    await item.related('photos').create({
      photoUrl: `/uploads/${photo.fileName}`,
    })
  }
}
```

**Kode SESUDAH:**
```typescript
import minioService from '#services/minio_service'
import { readFile } from 'node:fs/promises'

// ... di dalam method store():

for (const photo of photos) {
  if (photo.isValid) {
    // Baca file dari temp path
    const fileBuffer = await readFile(photo.tmpPath!)
    const contentType = `image/${photo.extname}`

    // Upload ke MinIO
    const objectKey = await minioService.uploadFile(fileBuffer, photo.clientName, contentType)

    // Simpan object key di database
    await item.related('photos').create({
      photoUrl: objectKey,
    })
  }
}
```

**Perbedaan utama:**
- ❌ Sebelum: `photo.move()` → menyimpan ke folder `public/uploads/`
- ✅ Sesudah: `readFile()` + `minioService.uploadFile()` → upload ke MinIO
- ❌ Sebelum: `photoUrl` = `/uploads/filename.jpg` (path lokal)
- ✅ Sesudah: `photoUrl` = `uploads/uuid.jpg` (object key MinIO)

---

### Step 3: Ubah `items_controller.ts` — Method `update()`

Lakukan perubahan yang sama persis seperti di method `store()`.

**Kode SEBELUM (baris 103-112):**
```typescript
for (const photo of photos) {
  if (photo.isValid) {
    await photo.move(app.publicPath('uploads'), {
      name: `${randomUUID()}.${photo.extname}`,
    })
    await item.related('photos').create({
      photoUrl: `/uploads/${photo.fileName}`,
    })
  }
}
```

**Kode SESUDAH:**
```typescript
for (const photo of photos) {
  if (photo.isValid) {
    const fileBuffer = await readFile(photo.tmpPath!)
    const contentType = `image/${photo.extname}`
    const objectKey = await minioService.uploadFile(fileBuffer, photo.clientName, contentType)

    await item.related('photos').create({
      photoUrl: objectKey,
    })
  }
}
```

---

### Step 4: Ubah `item_photos_controller.ts` — Method `destroy()`

**File:** `backend/app/controllers/item_photos_controller.ts`

**Perubahan yang perlu dilakukan:**

1. Hapus import `fs`, `app`, dan `join`
2. Tambah import `MinioService`
3. Ubah logika hapus file dari filesystem ke MinIO

**Kode SEBELUM (seluruh file):**
```typescript
import type { HttpContext } from '@adonisjs/core/http'
import ItemPhoto from '#models/item_photo'
import fs from 'node:fs'
import app from '@adonisjs/core/services/app'
import { join } from 'node:path'

export default class ItemPhotosController {
  async destroy({ params, response }: HttpContext) {
    const photo = await ItemPhoto.findOrFail(params.id)

    // Delete file from disk
    const filePath = join(app.publicPath(), photo.photoUrl)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await photo.delete()
    return response.noContent()
  }
}
```

**Kode SESUDAH:**
```typescript
import type { HttpContext } from '@adonisjs/core/http'
import ItemPhoto from '#models/item_photo'
import minioService from '#services/minio_service'

export default class ItemPhotosController {
  async destroy({ params, response }: HttpContext) {
    const photo = await ItemPhoto.findOrFail(params.id)

    // Hapus file dari MinIO
    try {
      await minioService.deleteFile(photo.photoUrl)
    } catch (error) {
      console.warn('Warning: Could not delete file from MinIO:', error.message)
    }

    await photo.delete()
    return response.noContent()
  }
}
```

---

### Step 5: Tambah Endpoint Baru untuk Mengambil Presigned URL

Karena foto sekarang disimpan di MinIO (bukan public folder), frontend perlu cara untuk mendapatkan URL foto yang bisa diakses.

**Opsi A (Recommended): Tambah computed property di Model**

Buat endpoint baru atau modifikasi response agar menyertakan presigned URL.

**Cara yang paling simpel:** Buat endpoint baru untuk mendapatkan URL foto.

**Tambah di `routes.ts`:**
```typescript
router.get('item-photos/:id/url', '#controllers/item_photos_controller.getUrl')
```

**Tambah method baru di `item_photos_controller.ts`:**
```typescript
async getUrl({ params, response }: HttpContext) {
  const photo = await ItemPhoto.findOrFail(params.id)
  const url = await minioService.getPresignedUrl(photo.photoUrl)
  return response.ok({ url })
}
```

**Opsi B (Lebih Simpel): Tambah photo URL di items response**

Ubah `items_controller.ts` agar setelah load photos, tambahkan presigned URL ke setiap foto.

**Di method `index()`, `show()`, `store()`, dan `update()`**, setelah query items, generate presigned URLs:

```typescript
// Setelah mendapatkan items/item:
for (const item of items) {
  for (const photo of item.photos) {
    photo.$extras.signedUrl = await minioService.getPresignedUrl(photo.photoUrl)
  }
}
```

Atau buat **transformer/serializer** yang otomatis menambahkan URL.

> **⚠️ PENTING:** Pilih salah satu opsi. Opsi B lebih simpel dan tidak memerlukan perubahan frontend yang banyak, tapi presigned URL akan selalu di-generate meskipun tidak dibutuhkan.

---

### Step 6: Update Frontend (`ItemCard.jsx`)

**File:** `frontend/src/views/apps/items/ItemCard.jsx`

**Perubahan tergantung opsi yang dipilih di Step 5.**

**Jika Opsi B (presigned URL di items response):**

```jsx
// SEBELUM (baris 37-39):
const mainPhoto = item.photos && item.photos.length > 0 
  ? `${process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '')}${item.photos[0].photoUrl}` 
  : 'https://placehold.co/600x400?text=No+Image'

// SESUDAH:
const mainPhoto = item.photos && item.photos.length > 0 
  ? item.photos[0].$extras?.signedUrl || item.photos[0].signedUrl
  : 'https://placehold.co/600x400?text=No+Image'
```

**Jika Opsi A (endpoint terpisah):**
Frontend perlu fetch URL foto secara terpisah via `GET /api/v1/item-photos/:id/url`.

---

### Step 7: (Opsional) Migrasi Foto Lama

Jika ada foto lama di `public/uploads/` yang perlu dipindahkan ke MinIO, buat script migrasi:

**File:** `backend/commands/migrate_photos_to_minio.ts` (AdonisJS Ace Command)

```typescript
// Pseudocode:
// 1. Query semua ItemPhoto dari database
// 2. Untuk setiap foto yang path-nya masih berupa path lokal (dimulai dengan /uploads/):
//    a. Baca file dari public/uploads/
//    b. Upload ke MinIO
//    c. Update photoUrl di database dengan object key baru
// 3. (Opsional) Hapus file lokal setelah migrasi berhasil
```

---

## Checklist Implementasi

- [ ] Buat `app/services/minio_service.ts`
- [ ] Update import di `items_controller.ts` (hapus `app`, `randomUUID`; tambah `minioService`, `readFile`)
- [ ] Ubah method `store()` di `items_controller.ts`
- [ ] Ubah method `update()` di `items_controller.ts`
- [ ] Ubah `item_photos_controller.ts` (hapus & ganti ke MinIO)
- [ ] Tambah mekanisme presigned URL (Opsi A atau B)
- [ ] Update frontend `ItemCard.jsx` untuk menggunakan URL baru
- [ ] Tambah `#services/*` ke `package.json` imports jika belum ada (cek sudah ada: `"#services/*": "./app/services/*.js"`)
- [ ] Test upload foto baru via API
- [ ] Test tampil foto di frontend
- [ ] Test hapus foto via API
- [ ] (Opsional) Migrasi foto lama dari `public/uploads/` ke MinIO

## File yang Perlu Diubah

| File | Aksi |
|------|------|
| `backend/app/services/minio_service.ts` | **BUAT BARU** — Service untuk interaksi MinIO |
| `backend/app/controllers/items_controller.ts` | **UBAH** — Upload foto ke MinIO |
| `backend/app/controllers/item_photos_controller.ts` | **UBAH** — Hapus foto dari MinIO |
| `backend/start/routes.ts` | **UBAH** (jika Opsi A) — Tambah endpoint URL foto |
| `frontend/src/views/apps/items/ItemCard.jsx` | **UBAH** — Akses foto via presigned URL |

## Referensi

- [MinIO JavaScript SDK Documentation](https://min.io/docs/minio/linux/developers/javascript/API.html)
- [AdonisJS File Upload Documentation](https://docs.adonisjs.com/guides/file-uploads)
- Bucket name: `shefly-password`
- MinIO endpoint: `server.hafiyyanabdulaziz.my.id:9002`

## Catatan Penting

1. **Jangan hapus `@adonisjs/static`** dari providers. Mungkin masih diperlukan untuk aset statis lain (CSS, JS, dll).
2. **Format `photoUrl` di database berubah:**
   - Lama: `/uploads/filename.jpg` (relative path ke public folder)
   - Baru: `uploads/uuid.jpg` (MinIO object key, tanpa leading slash)
3. **Presigned URL punya expiry time.** Default 7 hari. Jangan cache URL terlalu lama di frontend.
4. **Error handling:** Selalu wrap operasi MinIO dalam try-catch. Jangan sampai gagal upload/hapus MinIO menyebabkan error 500 tanpa informasi yang jelas.
