import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'
import minioService from '#services/minio_service'
import { readFile } from 'node:fs/promises'

export default class ItemsController {
  /**
   * Serialize items with presigned URLs for photos
   */
  private async serializeWithSignedUrls(items: Item[]) {
    const result = []

    for (const item of items) {
      const itemJson = item.toJSON()

      if (itemJson.photos && itemJson.photos.length > 0) {
        itemJson.photos = await Promise.all(
          itemJson.photos.map(async (photo: any) => ({
            ...photo,
            signedUrl: await minioService.getPresignedUrl(photo.photoUrl),
          }))
        )
      }

      result.push(itemJson)
    }

    return result
  }

  /**
   * Serialize a single item with presigned URLs for photos
   */
  private async serializeItemWithSignedUrls(item: Item) {
    const itemJson = item.toJSON()

    if (itemJson.photos && itemJson.photos.length > 0) {
      itemJson.photos = await Promise.all(
        itemJson.photos.map(async (photo: any) => ({
          ...photo,
          signedUrl: await minioService.getPresignedUrl(photo.photoUrl),
        }))
      )
    }

    return itemJson
  }

  /**
   * Display a list of resource
   */
  async index({ request, response }: HttpContext) {
    const { search, category_id, folder_id } = request.qs()

    const query = Item.query().preload('photos').preload('folder').preload('category')

    if (search) {
      query.where('name', 'like', `%${search}%`)
    }

    if (category_id) {
      query.where('categoryId', category_id)
    }

    if (folder_id) {
      query.where('folderId', folder_id)
    }

    const items = await query
    const serialized = await this.serializeWithSignedUrls(items)

    return response.ok(serialized)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only([
      'name',
      'description',
      'price',
      'purchaseDate',
      'location',
      'qty',
      'folderId',
      'categoryId',
    ])
    const item = await Item.create(data)

    const photos = request.files('photos', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    for (const photo of photos) {
      if (photo.isValid) {
        const fileBuffer = await readFile(photo.tmpPath!)
        const contentType = photo.contentType || 'image/jpeg'
        
        const objectKey = await minioService.uploadFile(fileBuffer, photo.clientName, contentType)
        
        await item.related('photos').create({
          photoUrl: objectKey,
        })
      }
    }

    await item.load('photos')
    const serialized = await this.serializeItemWithSignedUrls(item)
    return response.created(serialized)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const item = await Item.query()
      .where('id', params.id)
      .preload('photos')
      .preload('folder')
      .preload('category')
      .firstOrFail()

    const serialized = await this.serializeItemWithSignedUrls(item)
    return response.ok(serialized)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const item = await Item.findOrFail(params.id)
    const data = request.only([
      'name',
      'description',
      'price',
      'purchaseDate',
      'location',
      'qty',
      'folderId',
      'categoryId',
    ])
    item.merge(data)
    await item.save()

    const photos = request.files('photos', {
      size: '2mb',
      extnames: ['jpg', 'png', 'jpeg'],
    })

    for (const photo of photos) {
      if (photo.isValid) {
        const fileBuffer = await readFile(photo.tmpPath!)
        const contentType = photo.contentType || 'image/jpeg'
        
        const objectKey = await minioService.uploadFile(fileBuffer, photo.clientName, contentType)

        await item.related('photos').create({
          photoUrl: objectKey,
        })
      }
    }

    await item.load('photos')
    const serialized = await this.serializeItemWithSignedUrls(item)
    return response.ok(serialized)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const item = await Item.findOrFail(params.id)

    // Load and delete all photos from MinIO first
    await item.load('photos')

    for (const photo of item.photos) {
      try {
        await minioService.deleteFile(photo.photoUrl)
      } catch (error) {
        console.warn('Warning: Could not delete photo from MinIO:', error.message)
      }
    }

    // Delete the item (cascading delete will remove photo records if configured,
    // otherwise delete them manually)
    await item.related('photos').query().delete()
    await item.delete()

    return response.noContent()
  }
}