import { NextFunction, Request, RequestHandler, Response } from 'express';

export const wrapRequestHandler = (func: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      func(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
