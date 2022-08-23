import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Posts from 'App/Models/Post'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class PostsController {

    public async post({ request, response, auth }: HttpContextContract) {
       
        const validations = await schema.create({
            title: schema.string({}, [rules.required(), rules.maxLength(50), rules.unique({ table: 'posts', column: 'title' })]),
            content: schema.string({}, [rules.required()]),
        })

        const data = await request.validate({
            schema: validations,
            messages: {
                required: 'Le champs {{ field }} est requis pour créer un post',
                'title.maxLength': 'Le titre ne doit pas dépasser 50 caractères',
                'title.unique': 'Ce titre est déjà utilisé',
                'success': 'Votre post a été créé avec succès',
            }
        })

        await Posts.create({
            ...data,
            userUUID: auth.user?.id
        })

        return response.redirect('back')
    }

    public async get({ params, view }: HttpContextContract) {
            // get the id post
            const post = await Posts.find(params.id)
            // return the post
            return view.render('posts/post', {
                post: post,
            })
    }
}
