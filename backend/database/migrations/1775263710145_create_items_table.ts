import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.decimal('price', 12, 2).nullable()
      table.dateTime('purchase_date').nullable()
      table.string('location').nullable()
      table.integer('qty').defaultTo(1)
      table.integer('folder_id').unsigned().references('id').inTable('folders').onDelete('CASCADE').nullable()
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}