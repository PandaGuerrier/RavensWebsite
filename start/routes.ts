/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'
import './routes/users.ts'

Route.get('/', async ({ view }) => {
    return view.render('welcome')
})

Route.group(() => {
  Route.get('/auth/register', async ({ view }) => {
      return view.render('auth/register')
  })
  Route.post('/auth/register', 'Users/AuthController.register').as('register')

  Route.post('login', 'Users/AuthController.login').as('login')

}).middleware('guest')

Route.get('islogin', async ({ auth }) => {
  return auth.isLoggedIn
})

Route.group(() => {

  Route.get('dashboard', async ({ auth, view }) => {
    return view.render('dashboard', {
      username: auth.user?.username,
    })
  })
  Route.get('/auth/logout', 'Users/AuthController.logout')

}).middleware(['auth'])

// check db connection
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})