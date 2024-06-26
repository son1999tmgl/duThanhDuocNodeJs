import { NextFunction, Request, Response } from 'express';
import {
  FollowResBody,
  LogoutReqBody,
  RegisterReqBody,
  ResetPasswrodReqBody,
  TokenPayload,
  UpdateMeReqBody,
  VerifyForgotPasswrodReqBody
} from '~/models/requests/User.requests';
import { User } from '~/models/schemas/User.schema';
import { databaseService } from '~/services/database.services';
import userServices from '~/services/users.services';
import * as core from 'express-serve-static-core';
import { USERMESSAGES } from '~/constants/message';
import { ObjectId } from 'mongodb';
import { UserVerifyStatus } from '~/constants/enum';
import { ErrorWithStatus } from '~/models/Errors';
import * as _ from 'lodash';

export const loginController = async (req: Request, res: Response) => {
  const { user }: any = req;
  const user_id = user._id.toString();

  const result = await userServices.login({ user_id: user_id, verify: user.verify });
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

export const logoutController = async (
  req: Request<core.ParamsDictionary, any, LogoutReqBody, any, any>,
  res: Response
) => {
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
export const forgotPasswrordController = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;
  if (!user) {
    return next(new ErrorWithStatus({ message: USERMESSAGES.USER_NOT_FOUND, status: 401 }));
  }
  const user_id: string = user._id.toString();
  const result = await userServices.forgotPasswrod({ user_id: user_id, verify: user.verify });
  return res.status(200).json({
    message: `Vui lòng kiểm tra email ${req.body.email} để đặt lại mật khẩu`,
    forgotToken: result.forgotPasswrod
  });
};

export const verifyForgotPasswrordController = async (
  req: Request<core.ParamsDictionary, any, VerifyForgotPasswrodReqBody, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_passwrod_authorization as TokenPayload;
  const user = await databaseService.users.findOne(new ObjectId(user_id));
  if (!user) {
    return next(USERMESSAGES.USER_NOT_FOUND);
  }
  if (user.forgot_password_token !== req.body.forgot_password_token) {
    return next(new ErrorWithStatus({ message: 'Token ko hợp lệ', status: 401 }));
  }
  return res.status(200).json('Success');
};

export const resetPasswrordController = async (
  req: Request<core.ParamsDictionary, any, ResetPasswrodReqBody, any, any>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_forgot_passwrod_authorization as TokenPayload;
  if (!user_id) return next(new ErrorWithStatus({ message: 'Token ko hợp lệ', status: 401 }));
  const result = await userServices.resetPasswrod(user_id.toString(), req.body.password);
  return res.json({ result });
};

export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const user_id: ObjectId | undefined = req.decoded_authorization?.user_id;
  if (!user_id) {
    return next(new ErrorWithStatus({ message: USERMESSAGES.USER_NOT_FOUND, status: 401 }));
  }
  const user = await databaseService.users.findOne(new ObjectId(user_id));
  if (!user) {
    return next(new ErrorWithStatus({ message: USERMESSAGES.USER_NOT_FOUND, status: 401 }));
  }
  const result = await userServices.getMe(user_id.toString());
  return res.json({ result });
};

export const updateMeController = async (
  req: Request<core.ParamsDictionary, any, UpdateMeReqBody, any, any>,
  res: Response,
  next: NextFunction
) => {
  const user_id: ObjectId | undefined = req.decoded_authorization?.user_id;
  if (!user_id) {
    return next(new ErrorWithStatus({ message: USERMESSAGES.USER_NOT_FOUND, status: 401 }));
  }
  const result = await userServices.updateMe(user_id.toString(), req.body);
  return res.json({ result });
};

export const followController = async (
  req: Request<core.ParamsDictionary, any, FollowResBody, any, any>,
  res: Response,
  next: NextFunction
) => {
  const user_id: ObjectId | undefined = req.decoded_authorization?.user_id;
  const { follow_user_id } = req.body;
  if (!user_id) {
    return next(new ErrorWithStatus({ message: USERMESSAGES.USER_NOT_FOUND, status: 401 }));
  }
  const result = await userServices.follow(user_id.toString() as string, follow_user_id);
  return res.json({
    result: result,
    message: 'Follow thành công'
  });
};

export const unFollowController = async (
  req: Request<core.ParamsDictionary, any, FollowResBody, any, any>,
  res: Response,
  next: NextFunction
) => {
  const user_id: ObjectId | undefined = req.decoded_authorization?.user_id;
  const { follow_user_id } = req.query;
  if (!user_id) {
    return next(new ErrorWithStatus({ message: USERMESSAGES.USER_NOT_FOUND, status: 401 }));
  }
  const result = await userServices.unFollow(user_id.toString() as string, follow_user_id);
  return res.json({
    result: result,
    message: 'UnFollow thành công'
  });
};
