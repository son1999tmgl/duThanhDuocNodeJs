import { Router } from 'express';
import { loginController } from '~/controllers/users.controllers';
import { loginValidate } from '~/middlewares/users.middlewares';
const usesRouter = Router();

usesRouter.post('/tweets', loginValidate, loginController, (req, res) => {
  res.json({
    name: 'adf'
  });
});
export default usesRouter;
