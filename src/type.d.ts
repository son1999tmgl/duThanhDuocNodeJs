import { JwtPayload } from 'jsonwebtoken';
import { User } from './models/schemas/User.schema';
import { Request } from 'express';
import { TokenPayload } from './models/requests/User.requests';

declare module 'express' {
  interface Request {
    user?: User;
    decoded_authorization?: TokenPayload;
    decoded_refresh_token?: TokenPayload;
    decoded_email_verify_token?: TokenPayload;
    decoded_forgot_passwrod_authorization?: TokenPayload;
  }
}
