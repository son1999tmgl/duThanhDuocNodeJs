import { Request, Response } from 'express';
import { RegisterReqBody } from '~/models/requests/User.requests';
import { User } from '~/models/schemas/User.schema';
import { databaseService } from '~/services/database.services';
import userServices from '~/services/users.services';
import * as core from 'express-serve-static-core';

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = userServices.register(req.body);
    return res.status(400).json({
      message: 'success',
      result: result
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed',
      error: error
    });
  }
};

export const registerController = async (
  req: Request<core.ParamsDictionary, any, RegisterReqBody, any, any>,
  res: Response
) => {
  try {
    const result = userServices.register(req.body);
    return res.status(200).json({
      message: 'success',
      result: result
    });
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed',
      error: error
    });
  }
};
