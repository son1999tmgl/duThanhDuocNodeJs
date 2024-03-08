import { Router } from 'express';
import {
  emailVerifyController,
  forgotPasswrordController,
  getMeController,
  loginController,
  logoutController,
  registerController,
  resendEmailVerifyController,
  resetPasswrordController,
  updateMeController,
  verifyForgotPasswrordController
} from '~/controllers/users.controllers';
import {
  accessTokenValidate,
  forgotPasswrordValidate,
  loginValidate,
  refreshTokenValidate,
  registerValidate,
  resetPasswordValidator,
  updateMeValidator,
  verifyEmailTokenValidate,
  verifyForgotPasswordValidator,
  verifyUserValidator
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
/**
 * Description: Quên mật khẩu
 * Body: { email: string }
 */
usesRouter.post('/forgot-password', forgotPasswrordValidate, wrapRequestHandler(forgotPasswrordController));
/**
 * Description: Verify token quên mật khẩu
 * Body: { forgot_password_token: string }
 */
usesRouter.post(
  '/verify-forgot-password-token',
  verifyForgotPasswordValidator,
  wrapRequestHandler(verifyForgotPasswrordController)
);
/**
 * Description: reset passwrod
 * Body: { forgot_password_token: string, password: string, confirm_passwrod: string }
 */
usesRouter.post('/reset-passwrod', resetPasswordValidator, wrapRequestHandler(resetPasswrordController));
/**
 * Description: Lấy thông tin tài khoản
 */
usesRouter.get('/me', accessTokenValidate, wrapRequestHandler(getMeController));
/**
 * Description: Cập nhật thông tin tài khoản
 */
usesRouter.patch(
  '/me',
  accessTokenValidate,
  verifyUserValidator,
  updateMeValidator,
  wrapRequestHandler(updateMeController)
);
export default usesRouter;
