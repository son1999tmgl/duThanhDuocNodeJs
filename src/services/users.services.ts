import { User } from '~/models/schemas/User.schema';
import { databaseService } from './database.services';
import { RegisterReqBody } from '~/models/requests/User.requests';
import { hasPassword256 } from '~/utils/crypto';

class UserServices {
  private async signAcessToken(userId: string) {
    // signToken
  }
  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hasPassword256(payload.password)
      })
    );
    return result;
  }

  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email: email });
    return Boolean(user);
  }
}

const userServices = new UserServices();
export default userServices;
