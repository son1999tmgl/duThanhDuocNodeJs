import { User } from '~/models/schemas/User.schema';
import { databaseService } from './database.services';

class UserServices {
  async register(payload: { email: string; password: string }) {
    const result = await databaseService.users.insertOne(
      new User({ email: payload.email, password: payload.password })
    );
    return result;
  }
}

const userServices = new UserServices();
export default userServices;
