import { Router } from 'express';
import { loginController, logoutController, registerController } from '~/controllers/users.controllers';
import {
  accessTokenValidate,
  loginValidate,
  refreshTokenValidate,
  registerValidate
} from '~/middlewares/users.middlewares';
import { wrapRequestHandler } from '~/utils/handlers';
const usesRouter = Router();

/**
 * Description: Register a new user
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
usesRouter.post('/register', registerValidate, wrapRequestHandler(registerController));
usesRouter.post('/login', loginValidate, wrapRequestHandler(loginController));
usesRouter.post('/logout', accessTokenValidate, refreshTokenValidate, wrapRequestHandler(logoutController));
export default usesRouter;
