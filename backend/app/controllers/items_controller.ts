import type { HttpContext } from '@adonisjs/core/http'
import Item from '#models/item'
import app from '@adonisjs/core/services/app'
import { randomUUID } from 'node:crypto'

export default class ItemsController {
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
    return response.ok(items)
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
        await photo.move(app.publicPath('uploads'), {
          name: `${randomUUID()}.${photo.extname}`,
        })
        await item.related('photos').create({
          photoUrl: `/uploads/${photo.fileName}`,
        })
      }
    }

    await item.load('photos')
    return response.created(item)
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
    return response.ok(item)
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
        await photo.move(app.publicPath('uploads'), {
          name: `${randomUUID()}.${photo.extname}`,
        })
        await item.related('photos').create({
          photoUrl: `/uploads/${photo.fileName}`,
        })
      }
    }

    await item.load('photos')
    return response.ok(item)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const item = await Item.findOrFail(params.id)
    await item.delete()
    return response.noContent()
  }
}