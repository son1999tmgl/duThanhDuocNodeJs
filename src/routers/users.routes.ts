import { Router } from 'express';
import { loginController, registerController } from '~/controllers/users.controllers';
import { loginValidate, registerValidate } from '~/middlewares/users.middlewares';
const usesRouter = Router();

usesRouter.post('/tweets', loginValidate, loginController, (req, res) => {
  res.json({
    name: 'adf'
  });
});

/**
 * Description: Register a new user
 * Body: { name: string, email: string, password: string, confirm_password: string, date_of_birth: ISO8601 }
 */
usesRouter.post('/register', registerValidate, registerController);
export default usesRouter;
