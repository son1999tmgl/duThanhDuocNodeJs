import { NextFunction, Request, Response } from 'express';
import { RegisterReqBody } from '~/models/requests/User.requests';
import { User } from '~/models/schemas/User.schema';
import { databaseService } from '~/services/database.services';
import userServices from '~/services/users.services';
import * as core from 'express-serve-static-core';
import { USERMESSAGES } from '~/constants/message';
import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum';

export const loginController = async (req: Request, res: Response) => {
  const { user }: any = req;
  const user_id = user._id.toString();
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

export const emailVerifyController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id: ObjectId | undefined = req.decoded_email_verify_token?.user_id;
  const user = await databaseService.users.findOne(new ObjectId(user_id));
  if (!user) {
    return next(new Error(USERMESSAGES.USER_NOT_FOUND));
  }
  if (!user.email_verify_token || user.verify === UserVerifyStatus.Verified) {
    return next(new Error(USERMESSAGES.ACCOUNT_ALREADY_VERIFIED));
  }
  const result = await userServices.verifyEmail(user_id as ObjectId);
  return res.status(200).json({
    // message: result.message,
    result: result
  });
};

export const resendEmailVerifyController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id: ObjectId | undefined = req.decoded_authorization?.user_id;
  const user = await databaseService.users.findOne(new ObjectId(user_id));
  if (!user) {
    return next(new Error(USERMESSAGES.USER_NOT_FOUND));
  }
  if (!user.email_verify_token || user.verify === UserVerifyStatus.Verified) {
    return next(new Error(USERMESSAGES.ACCOUNT_ALREADY_VERIFIED));
  }
  const result = await userServices.resentEmailVerify(user_id as ObjectId);
  return res.status(200).json({
    // message: result.message,
    result: result
  });
};
