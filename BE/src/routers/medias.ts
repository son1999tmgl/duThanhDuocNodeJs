import { Router } from 'express';
import { upLoadImageController, getImageController, upLoadVideoController } from '~/controllers/media.conteollers';
import { wrapRequestHandler } from '~/utils/handlers';

export const mediaRouter = Router();

mediaRouter.post('/images', wrapRequestHandler(upLoadImageController));
mediaRouter.get('/images/:filename', wrapRequestHandler(getImageController));

mediaRouter.post('/videos', wrapRequestHandler(upLoadVideoController));
mediaRouter.get('/videos/:filename', wrapRequestHandler(getImageController));
