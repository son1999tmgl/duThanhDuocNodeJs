import { Router } from 'express';
import { upLoadImageController } from '~/controllers/media.conteollers';
import { wrapRequestHandler } from '~/utils/handlers';
import express from 'express';
import path from 'path';
import fs from 'fs';

export const mediaRouter = Router();

mediaRouter.post('/images', wrapRequestHandler(upLoadImageController));
mediaRouter.get('/images/:filename', (req, res) => {
  console.log(12345678);

  const fileName = req.params.filename;
  const imgPath = path.resolve(`./media/images/${fileName}.jpeg`);
  if (fs.existsSync(imgPath)) return res.sendFile(imgPath);
  else return res.json({ message: 'not file' });
});
