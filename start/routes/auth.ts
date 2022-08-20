import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.group(() => {
        Route.get('', 'Users/AuthController.loginView').as('login')
        Route.post('', 'Users/AuthController.login')
    }).prefix('login')

    Route.group(() => {
        Route.get('', 'Users/AuthController.registerView').as('register')
        Route.post('', 'Users/AuthController.register')
    }).prefix('register')
}).middleware(['guest']).prefix('/auth/')

Route.get('/auth/logout', 'Users/AuthController.logout').as('logout').middleware(['auth'])