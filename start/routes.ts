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
import './routes/auth'

Route.get('/', async ({ view }) => {
    return view.render('home')
}).as('home')

Route.group(() => {
  Route.get('dashboard', async ({ view }) => {
    return view.render('admin/dashboard')
  }).as('dashboard')

  Route.get('post', 'Posts/PostsController.admin')


  Route.group(() => {
    Route.get('create', async ({ view }) => {
      return view.render('admin/post/create')
    }).as('post.create')

    Route.get('trailer', async ({ view }) => {
      return view.render('admin/post/trailer')
    })
  }).prefix('post/')

  Route.post('post', 'Posts/PostsController.create').as('post')

}).middleware(['auth', 'admin']).prefix('/admin/')

Route.group(() => {
  Route.group(() => {
    Route.get('edit/:id', 'Posts/PostsController.edit').as('posts.edit')
    Route.get('destroy/:id', 'Posts/PostsController.destroy').as('posts.destroy')
  })

  Route.get('all', 'Posts/PostsController.index').as('posts.index')
  Route.get(':id', 'Posts/PostsController.get').as('posts')
}).prefix('/posts/')



// check db connection
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})
