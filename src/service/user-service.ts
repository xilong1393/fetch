import { UserDao } from '../dao/user-dao'
import IUser from '../model/schema/IUser'

export class UserService {

    userDao: UserDao = new UserDao()

    getAllUsers = async () => {
        const list = await this.userDao.getAllUsers()
        return list
    }

    addUser = async (user: IUser) => {
        const result = await this.userDao.addUser(user)
        return result
    }

}