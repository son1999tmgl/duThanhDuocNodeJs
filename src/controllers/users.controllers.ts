import { Request, Response } from 'express';
import { RegisterReqBody } from '~/models/requests/User.requests';
import { User } from '~/models/schemas/User.schema';
import { databaseService } from '~/services/database.services';
import userServices from '~/services/users.services';
import * as core from 'express-serve-static-core';

export const loginController = async (req: Request, res: Response) => {
  const { user }: any = req;
  const { user_id } = user;
  const result = await userServices.login(user_id);
  return res.status(200).json({
    message: 'success',
    result: result
  });
};

export const registerController = async (
  req: Request<core.ParamsDictionary, any, RegisterReqBody, any, any>,
  res: Response
) => {
  const result = await userServices.register(req.body);
  return res.status(200).json({
    message: 'success',
    result: result
  });
};

export const logoutController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;
  const result = await userServices.logout(refresh_token);
  return res.status(200).json({
    message: result.message,
    result: result
  });
};
