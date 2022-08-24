import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export class UpdateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    title: schema.string.optional({}, [rules.maxLength(50), rules.unique({ table: 'posts', column: 'title' })]),
    content: schema.string.optional({}, []),
    published: schema.boolean.optional()
  })

  public messages: CustomMessages = {}
}

