import jwt from 'jsonwebtoken';

function sign(payload: string | Buffer | object, privateKey: string, signOptions: jwt.SignOptions) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, privateKey, signOptions, function (err, token) {
      if (err) throw reject(err);
      resolve('');
    });
  });
}

export function signToken(
  payload: any,
  privateKey: string = process.env.JWT_SECRET as string,
  signOptions: jwt.SignOptions = { algorithm: 'HS256' }
) {
  return sign(payload, privateKey, signOptions);
}
