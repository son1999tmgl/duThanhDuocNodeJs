import { JwtPayload } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export interface RegisterReqBody {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
  date_of_birth: string;
}
export interface TokenPayload extends JwtPayload {
  user_id?: ObjectId;
  token?: string;
}
