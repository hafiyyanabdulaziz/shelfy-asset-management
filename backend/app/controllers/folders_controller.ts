import type { HttpContext } from '@adonisjs/core/http'
import Folder from '#models/folder'

export default class FoldersController {
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