import { Router } from 'express';
import { loginController, registerController } from '~/controllers/users.controllers';
import { loginValidate, registerValidate } from '~/middlewares/users.middlewares';
import { wrapAsync } from '~/utils/handlers';
const usesRouter = Router();

/**
 * Description: Register a new user
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
usesRouter.post('/register', registerValidate, wrapAsync(registerController));
export default usesRouter;
