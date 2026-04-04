import { CategorySchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'

export default class Category extends CategorySchema {
  @hasMany(() => Item)
  declare items: HasMany<typeof Item>
}