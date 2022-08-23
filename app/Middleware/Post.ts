import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Post {
  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    console.log(request)
    
    await next()
  }
}
