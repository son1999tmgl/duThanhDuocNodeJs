import express, { NextFunction, Request, Response } from 'express';
import usesRouter from './routers/users.routes';
import { databaseService } from './services/database.services';
import { defaultErrorHandler } from './middlewares/error.middlewares';
import { oauth2Controller } from './controllers/users.controllers';

databaseService.connect();

const app = express();
const PORT = 4000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('');
});

app.use('/user', usesRouter);
app.use('/api/oauthGoogle', oauth2Controller);
app.use('/api/oauthAccessToken', (req: Request, res: Response) => {
  console.log(req);
  console.log('req.params: ', req.params);
  console.log('req.query: ', req.query);
  console.log('body: ', req.body);
  return res.json({});
});
app.use(defaultErrorHandler);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
