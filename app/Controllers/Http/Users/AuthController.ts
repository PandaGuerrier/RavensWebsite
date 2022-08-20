import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async register({ request, response, auth }: HttpContextContract) {
    // validate email
    const validations = await schema.create({
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.confirmed()]),
      username: schema.string({}, [rules.unique({ table: 'users', column: 'username' })]),
    })
    const data = await request.validate({
      schema: validations,
      messages: {
        required: 'Le champs {{ field }} est requis pour créer un compte',
        'email.email': 'Veuillez entrer une adresse email valide',
        'email.unique': 'Cette adresse email est déjà utilisée',
        'password.confirmed': 'Les mots de passe ne correspondent pas',
        'password_confirmation': 'Les mots de passe ne correspondent pas',
        'password': 'Le mot de passe doit contenir au moins 6 caractères',
        'username.unique': 'Ce nom d\'utilisateur est déjà utilisé',   
        'success': 'Votre compte a été créé avec succès',
      }
    })

    await User.create(data)
    await auth.use('web').attempt(request.input('email'), request.input('password'))

    return response.redirect('/')
  }

  //   login function
  public async login({ request, response, auth }: HttpContextContract) {
    const password = await request.input('password')
    const email = await request.input('email')

    try {
      const token = await auth.use('web').attempt(email, password)
      return token.toJSON()
    } catch {
      return response
        .status(400)
        .send({ error: { message: 'Utilisateur inconnu !' } })
    }
  }

  //   logout function
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/')
  }
}
