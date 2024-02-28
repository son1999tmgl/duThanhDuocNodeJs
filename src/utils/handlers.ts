import { NextFunction, Request, RequestHandler, Response } from 'express';

export const wrapAsync = (func: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
