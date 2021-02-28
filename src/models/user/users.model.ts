import { DATABASE_TABLES } from 'interfaces/database.interfaces'
import MasterServices from 'models/master.models'

class UserModel extends MasterServices {
  private static _instance: UserModel
  private constructor() {
    super(DATABASE_TABLES.users)
  }

  public static get instance(): UserModel {
    if (UserModel._instance === undefined) {
      UserModel._instance = new UserModel()
    }
    return UserModel._instance
  }
}

export default UserModel.instance
