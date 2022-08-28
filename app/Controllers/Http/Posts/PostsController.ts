import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Posts from 'App/Models/Post'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { UpdateValidator } from 'App/Validators/PostValidator'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'

export default class PostsController {
    public async index ({ view }: HttpContextContract) {
        const posts = await Posts.query().where('published', true).orderBy('id', 'asc')

        return view.render('posts/index', {
            posts: posts,
            length: posts.length,
        })
    }

    public async admin ({ view }: HttpContextContract) {
        const posts = await Posts.query().orderBy('id', 'asc')

        return view.render('admin/post', {
            posts: posts,
            length: posts.length,
        })
    }

    public async create ({ request, response, auth }: HttpContextContract) {

        const validations = await schema.create({
            title: schema.string({}, [rules.required(), rules.maxLength(50), rules.unique({ table: 'posts', column: 'title' })]),
            content: schema.string({}, [rules.required()]),
            type: schema.string.optional({}, []),
            img: schema.file.optional(),
            url: schema.string.optional(),
        })

        const data = await request.validate({
            schema: validations,
            messages: {
                required: 'Le champs {{ field }} est requis pour créer un post',
                'title.maxLength': 'Le titre ne doit pas dépasser 50 caractères',
                'title.unique': 'Ce titre est déjà utilisé',
                'content.required': 'Le contenu est requis pour créer un post',
                'type.required': 'Le type est requis pour créer un post',
                'img.file': 'Le fichier n\'est pas une image',
                'success': 'Votre post a été créé avec succès',
            }
        })

       const post = await Posts.create({
            ...data,
            userUUID: auth.user?.id,
            img: data.img
            ? Attachment.fromFile(data.img)
            : undefined,
        })
        //redirect to the post
        return response.redirect("/posts/" + post.id)
    }

    public async get({ params, view }: HttpContextContract) {
        // get the id post
        const post = await Posts.find(params.id)
        if(!post) return view.render('errors/404')
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
            if (auth.user?.id === post?.userUUID || auth.user?.role === 'admin') {
                await post?.delete()

                return response.redirect('back')
            } else {
                return response.redirect('back')
            }
        } else {
            return response.redirect('home')
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
