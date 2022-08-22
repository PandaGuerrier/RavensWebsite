import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Posts from 'App/Models/Post'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class PostsController {

    public async post({ request }: HttpContextContract) {
        
        const validations = await schema.create({
            title: schema.string({}, [rules.required()]),
            content: schema.string({}, [rules.required()]),
        })

        const data = await request.validate({
            schema: validations,
            messages: {
                required: 'Le champs {{ field }} est requis pour créer un post',
                'success': 'Votre post a été créé avec succès',
            }
        })
        
        console.log(data)

        return await Posts.create(data)
    }
}
