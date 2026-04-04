import { ItemSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Folder from '#models/folder'
import Category from '#models/category'
import ItemPhoto from '#models/item_photo'

export default class Item extends ItemSchema {
  @belongsTo(() => Folder)
  declare folder: BelongsTo<typeof Folder>

  @belongsTo(() => Category)
  declare category: BelongsTo<typeof Category>

  @hasMany(() => ItemPhoto)
  declare photos: HasMany<typeof ItemPhoto>
}