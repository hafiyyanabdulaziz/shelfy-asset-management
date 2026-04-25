import type { HttpContext } from '@adonisjs/core/http'
import Folder from '#models/folder'
import Item from '#models/item'
import minioService from '#services/minio_service'

export default class FoldersController {
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
   * Build breadcrumb trail dari folder saat ini sampai root
   */
  private async buildBreadcrumbs(folderId: number | null) {
    const breadcrumbs: { id: number; name: string }[] = []

    let currentId = folderId

    while (currentId) {
      const folder = await Folder.find(currentId)

      if (!folder) break

      breadcrumbs.unshift({ id: folder.id, name: folder.name })
      currentId = folder.parentId
    }

    return breadcrumbs
  }

  /**
   * Browse folder contents - returns sub-folders and items at a given level
   * GET /api/v1/folders/browse?parentId=123  (atau tanpa parentId untuk root)
   */
  async browse({ request, response }: HttpContext) {
    const { parentId, search } = request.qs()

    // Query sub-folders di level ini
    const foldersQuery = Folder.query().orderBy('name', 'asc')

    if (parentId) {
      foldersQuery.where('parentId', parentId)
    } else {
      foldersQuery.whereNull('parentId')
    }

    if (search) {
      foldersQuery.where('name', 'like', `%${search}%`)
    }

    const folders = await foldersQuery

    // Query items di level ini (preload photos untuk thumbnail)
    const itemsQuery = Item.query()
      .preload('photos')
      .preload('category')
      .orderBy('name', 'asc')

    if (parentId) {
      itemsQuery.where('folderId', parentId)
    } else {
      itemsQuery.whereNull('folderId')
    }

    if (search) {
      itemsQuery.where('name', 'like', `%${search}%`)
    }

    const items = await itemsQuery

    // Generate signed URLs untuk foto item
    const serializedItems = await this.serializeWithSignedUrls(items)

    // Bangun breadcrumb path
    const breadcrumbs = await this.buildBreadcrumbs(parentId || null)

    return response.ok({
      folders,
      items: serializedItems,
      breadcrumbs,
      currentFolderId: parentId || null,
    })
  }

  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const folders = await Folder.all()
    return response.ok(folders)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'parentId'])
    const folder = await Folder.create(data)
    return response.created(folder)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const folder = await Folder.query()
      .where('id', params.id)
      .preload('children')
      .preload('items')
      .firstOrFail()
    return response.ok(folder)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const folder = await Folder.findOrFail(params.id)
    const data = request.only(['name', 'parentId'])
    folder.merge(data)
    await folder.save()
    return response.ok(folder)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const folder = await Folder.findOrFail(params.id)
    await folder.delete()
    return response.noContent()
  }
}