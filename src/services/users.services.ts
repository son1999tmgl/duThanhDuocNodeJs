import { User } from '~/models/schemas/User.schema';
import { databaseService } from './database.services';
import { RegisterReqBody, UpdateMeReqBody } from '~/models/requests/User.requests';
import { hasPassword256 } from '~/utils/crypto';
import { signToken } from '~/utils/jwt';
import { TokenType, UserVerifyStatus } from '~/constants/enum';
import { RefreshToken } from '~/models/schemas/RefreshToken';
import { ObjectId } from 'mongodb';
import { USERMESSAGES } from '~/constants/message';

class UserServices {
  private async signAcessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
        verify: verify
      },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
      }
    });
  }
  private async signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken,
        verify: verify
      },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: {
        expiresIn: process.env.VERIFY_EMAIL_TOKEN_EXPIRES_IN
      }
    });
  }
  private async signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken,
        verify: verify
      },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: {
        expiresIn: process.env.FORGOT_PASSWORD_TOKEN_EXPIRES_IN
      }
    });
  }

  private async signVerifyEmailToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefeshToken,
        verify: verify
      },
      privateKey: process.env.JWT_SECRET_VERIFY_EMAIL_TOKEN as string,
      options: {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
      }
    });
  }
  private signAccessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAcessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })]);
  }

  async checkEmailExists(email: string) {
    const user = await databaseService.users.findOne({ email: email });
    return Boolean(user);
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId();
    const [[accessToken, refreshToken], verifyEmailToken] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified }),
      this.signVerifyEmailToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified })
    ]);
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        date_of_birth: new Date(payload.date_of_birth),
        password: hasPassword256(payload.password),
        email_verify_token: verifyEmailToken
      })
    );
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken
      })
    );
    return {
      user: result,
      accessToken,
      refreshToken,
      verifyEmailToken
    };
  }

  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      user_id: user_id,
      verify: verify
    });
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

  async verifyEmail(user_id: ObjectId) {
    const [[accessToken, refreshToken]] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne(
        {
          _id: new ObjectId(user_id)
        },
        {
          $set: {
            verify: UserVerifyStatus.Verified,
            email_verify_token: ''
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ]);
    return {
      accessToken,
      refreshToken
    };
  }

  async resentEmailVerify(user_id: ObjectId) {
    const [[accessToken, refreshToken], verifyEmailToken] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified }),
      this.signVerifyEmailToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Unverified })
    ]);
    databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          email_verify_token: verifyEmailToken
        }
      }
    );
    return {
      accessToken,
      refreshToken
    };
  }

  async forgotPasswrod({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const forgotPasswrod = await this.signForgotPasswordToken({ user_id, verify });
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: forgotPasswrod
        },
        $currentDate: {
          updated_at: true
        }
      }
    );
    return { forgotPasswrod };
  }

  async resetPasswrod(user_id: string, password: string) {
    const user = (await databaseService.users.findOne(new ObjectId(user_id))) as User;
    const [accessToken, refreshToken] = await this.signAccessAndRefreshToken({
      user_id: user_id.toString(),
      verify: user.verify
    });
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hasPassword256(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    );
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        user_id: new ObjectId(user_id),
        token: refreshToken
      })
    );
    return { accessToken, refreshToken };
  }
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      {
        projection: {
          password: 0,
          forgot_password_token: 0,
          email_verify_token: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    );
    return { user };
  }

  async updateMe(user_id: string, body: UpdateMeReqBody) {
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          ...body
        }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          forgot_password_token: 0,
          email_verify_token: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    );
    return user;
  }
}

const userServices = new UserServices();
export default userServices;
