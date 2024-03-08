import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export interface RegisterReqBody {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
}

export interface LogoutReqBody {
  refresh_token: string;
}
export interface VerifyForgotPasswrodReqBody {
  forgot_password_token: string;
}
export interface ResetPasswrodReqBody {
  forgot_password_token: string;
  password: string;
  confirm_password: string;
}
export interface UpdateMeReqBody {
  name?: string;
  date_of_birth?: Date;
  bio?: string;
  location?: string;
  website?: string;
  username?: string;
  avatar?: string;
  cover_photo?: string;
}

export interface TokenPayload extends JwtPayload {
  user_id?: ObjectId;
  token?: string;
}
