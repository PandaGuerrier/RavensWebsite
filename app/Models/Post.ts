import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public userUUID: string

  @column()
  public published: boolean

  @column()
  public type: string

  @attachment({ preComputeUrl: true })
  public img: AttachmentContract

  @column()
  public url: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static async TransformToEmbed( model: Post ) {
    if(model.url) {
      return model.url = model.url.replace('https://www.youtube.com/watch?v=', 'https://www.youtube.com/embed/')
    }
  }
}
