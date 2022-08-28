import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        username: 'Panda',
        email: 'juleslofficial@gmail.com',
        password: 'panda',
        role: 'admin'
      }])
  }
}
