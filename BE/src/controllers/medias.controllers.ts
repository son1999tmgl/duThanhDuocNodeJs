import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
export const setFileController = async (req: Request, res: Response, next: NextFunction) => {  
  const form = formidable({
    uploadDir: path.resolve('images'),
    keepExtensions: true,
    allowEmptyFiles: false,
    multiples: false,
    maxFileSize: 1024
  });
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.json(err);
    }
    return res.json(files);
  });
}
