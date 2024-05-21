import { Router } from "express";
import { setFileController } from "~/controllers/medias.controllers";
import { wrapRequestHandler } from "~/utils/handlers";

const mediasRouter = Router();
mediasRouter.post('/set-image', wrapRequestHandler(setFileController));

export default mediasRouter;
