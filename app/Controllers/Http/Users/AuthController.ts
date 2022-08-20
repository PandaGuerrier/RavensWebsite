import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

export default class AuthController {
  public async registerView({ view }: HttpContextContract) {
    return view.render('auth/register')
  }

  public async register({ request, response, auth }: HttpContextContract) {

    const validations = await schema.create({
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.confirmed()]),
      username: schema.string({}, [rules.unique({ table: 'users', column: 'username' }), rules.maxLength(16)]),
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
        'username.maxLength': 'Le nom d\'utilisateur ne doit pas dépasser 16 caractères',
        'success': 'Votre compte a été créé avec succès',
      }
    })
// creer un validator
    const user = await User.create(data)
    await auth.login(user)

    return response.redirect('back')
  }

  public async loginView({ view }: HttpContextContract) {
    return view.render('auth/login')
  }
  //   login function
  public async login({ request, response, auth, session }: HttpContextContract) {

    const email = request.input('email')
    const password = request.input('password')

    try {
      await auth.use('web').attempt(email, password)

      return response.redirect('/')
    } catch (error) {
      session.flash('notification', 'Email ou mot de passe incorrect')

      return response.redirect('back')
    }
  }

  //   logout function
  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.redirect('/')
  }
}
