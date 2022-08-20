
import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  // registration logic
  Route.post('login', 'Users/AuthController.login').as('login')
  Route.post('logout', 'Users/AuthController.logout').as('logout')
})