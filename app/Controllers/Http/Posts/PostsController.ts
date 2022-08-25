import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Posts from 'App/Models/Post'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { UpdateValidator } from 'App/Validators/PostValidator'
import Application from '@ioc:Adonis/Core/Application'

export default class PostsController {
    public async index ({ view }: HttpContextContract) {
        const posts = await Posts.query().orderBy('title', 'asc')

        return view.render('posts/index', {
            posts: posts,
        })
    }

    public async create ({ request, response, auth }: HttpContextContract) {


        const validations = await schema.create({
            title: schema.string({}, [rules.required(), rules.maxLength(50), rules.unique({ table: 'posts', column: 'title' })]),
            content: schema.string({}, [rules.required()]),
            type: schema.string({}, [rules.required()]),
            img: schema.file({
                size: '2mb',
                extnames: ['jpg', 'gif', 'png'],
              }),
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

        await data.img.move(Application.tmpPath('uploads'))


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

    public async destroy ({ params, response, auth }: HttpContextContract) {
        const post = await Posts.find(params.id)

        if (!post) return response.send({
            status: 400,
            message: "Post inconnu"
        })
        if (auth.isLoggedIn) {
            if (auth.user?.id === post?.userUUID) {
                await post?.delete()

                return response.send({
                    status: 200,
                    message: "Post détruit !"
                })
            } else {
                return response.send({
                    status: 400,
                    message: "UnAuthorized."
                })
            }
        } else {
            return response.send({
                status: 400,
                message: "UnAuthorized."
            })
        }
    }

    public async update ({ request, params, response }: HttpContextContract) {
        const post = await Posts.find(params.id)
        
        if(!post) return response.send({
            message: "Post introuvable"
        })

        const data = await request.validate(UpdateValidator)

        await post.merge(data).save()

        return response.send({
            message: "Post modifié",
            post: post
        })   
    }
}
