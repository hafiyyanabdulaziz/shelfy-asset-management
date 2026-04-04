import type { HttpContext } from '@adonisjs/core/http'
import Category from '#models/category'

export default class CategoriesController {
  /**
   * Display a list of resource
   */
  async index({ response }: HttpContext) {
    const categories = await Category.all()
    return response.ok(categories)
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request, response }: HttpContext) {
    const data = request.only(['name'])
    const category = await Category.create(data)
    return response.created(category)
  }

  /**
   * Show individual record
   */
  async show({ params, response }: HttpContext) {
    const category = await Category.query()
      .where('id', params.id)
      .preload('items')
      .firstOrFail()
    return response.ok(category)
  }

  /**
   * Handle form submission for the edit action
   */
  async update({ params, request, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    const data = request.only(['name'])
    category.merge(data)
    await category.save()
    return response.ok(category)
  }

  /**
   * Delete record
   */
  async destroy({ params, response }: HttpContext) {
    const category = await Category.findOrFail(params.id)
    await category.delete()
    return response.noContent()
  }
}