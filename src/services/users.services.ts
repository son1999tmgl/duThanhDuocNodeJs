import { User } from '~/models/schemas/User.schema';
import { databaseService } from './database.services';

class UserServices {
  async register(payload: { email: string; password: string }) {
    const result = await databaseService.users.insertOne(
      new User({ email: payload.email, password: payload.password })
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
