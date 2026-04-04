import { FolderSchema } from '#database/schema'
import { belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Item from '#models/item'

export default class Folder extends FolderSchema {
  @belongsTo(() => Folder, { foreignKey: 'parentId' })
  declare parent: BelongsTo<typeof Folder>

  @hasMany(() => Folder, { foreignKey: 'parentId' })
  declare children: HasMany<typeof Folder>

  @hasMany(() => Item)
  declare items: HasMany<typeof Item>
}