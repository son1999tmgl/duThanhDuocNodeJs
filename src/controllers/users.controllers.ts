import { Request, Response } from 'express';
import { User } from '~/models/schemas/User.schema';
import { databaseService } from '~/services/database.services';
import userServices from '~/services/users.services';

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = userServices.register({ email, password });
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
