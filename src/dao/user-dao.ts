import { logger } from "../helper/winston-logger"
import { User } from "../model/schema/User"

export class UserDao {

    getAllUsers = async () => {
        const list = User.find({})
        return list
    }

    addUser = async (user: IUser) => {
        const userModel = new User(user)
        const result = await userModel.save()
        return result
    }

}