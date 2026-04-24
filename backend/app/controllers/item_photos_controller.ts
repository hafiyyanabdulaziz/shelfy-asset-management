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