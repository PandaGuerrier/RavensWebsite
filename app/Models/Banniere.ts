import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Banniere extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.file({
    path: 'assets/images/banniere/:filename',
    relativeTo: 'public',
    gc: true,
  })

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
