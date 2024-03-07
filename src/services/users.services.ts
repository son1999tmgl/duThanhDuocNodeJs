import { User } from '~/models/schemas/User.schema';
import { databaseService } from './database.services';
import { RegisterReqBody } from '~/models/requests/User.requests';
import { hasPassword256 } from '~/utils/crypto';
import { signToken } from '~/utils/jwt';
import { TokenType } from '~/constants/enum';
import { RefreshToken } from '~/models/schemas/RefreshToken';
import { ObjectId } from 'mongodb';
import { USERMESSAGES } from '~/constants/message';

class UserServices {
  private async signAcessToken(user_id: string) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken
      },
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    });
  }
  private async signRefreshToken(user_id: string) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken
      },
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    });
  }
  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAcessToken(user_id), this.signRefreshToken(user_id)]);
  }

  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email: email });
    return Boolean(user);
  }

  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hasPassword256(payload.password)
      })
    );
    const user_id = result.insertedId.toString();
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id);
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken
      })
    );
    return {
      user: result,
      accessToken,
      refreshToken
    };
  }
  async login(user_id: string) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken(user_id);
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken
      })
    );
    return {
      accessToken,
      refreshToken
    };
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token });
    return {
      message: USERMESSAGES.LOGOUT_SUCCESS
    };
  }
}

const userServices = new UserServices();
export default userServices;
