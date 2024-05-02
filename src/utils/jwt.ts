import jwt from 'jsonwebtoken';
import { TokenPayload } from '~/models/requests/User.requests';

export const signToken = ({
  payload,
  privateKey,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: string | Buffer | object;
  privateKey: string;
  options?: jwt.SignOptions;
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, function (err, token) {
      if (err) throw reject(err);
      resolve(token as string);
    });
  });
};

export const verifyToken = ({ token, secretOnPublicKey }: { token: string; secretOnPublicKey: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOnPublicKey, function (err, decoded) {
      if (err) throw reject(err);
      resolve(decoded as TokenPayload);
    });
  });
};
