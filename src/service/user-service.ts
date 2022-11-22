import { UserDao } from '../dao/user-dao'

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