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