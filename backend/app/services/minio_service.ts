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
    // Check if objectKey is already a full URL (legacy or external)
    if (objectKey.startsWith('http')) {
      return objectKey
    }
    
    // Check if it's a local path (legacy) — generate full URL to backend
    if (objectKey.startsWith('/uploads/')) {
      return `${env.get('APP_URL')}${objectKey}`
    }

    try {
      return await this.client.presignedGetObject(this.bucket, objectKey, expirySeconds)
    } catch (error) {
      console.error('Error generating presigned URL:', error)
      return objectKey // Fallback
    }
  }

  /**
   * Hapus file dari MinIO
   * @param objectKey - Key/path file di MinIO
   */
  async deleteFile(objectKey: string): Promise<void> {
    if (objectKey.startsWith('http') || objectKey.startsWith('/uploads/')) {
        return
    }
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
