import { Router } from 'express';
import {
  emailVerifyController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController
} from '~/controllers/users.controllers';
import {
  accessTokenValidate,
  loginValidate,
  refreshTokenValidate,
  registerValidate,
  verifyEmailTokenValidate
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
usesRouter.post('/verify-email', verifyEmailTokenValidate, wrapRequestHandler(emailVerifyController));
usesRouter.post('/resend-verify-email', accessTokenValidate, wrapRequestHandler(resendEmailVerifyController));
export default usesRouter;
