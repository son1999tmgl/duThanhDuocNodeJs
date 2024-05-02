import express, { NextFunction, Request, Response } from 'express';
import usesRouter from './routers/users.routes';
import { databaseService } from './services/database.services';
import { defaultErrorHandler } from './middlewares/error.middlewares';

databaseService.connect();

const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('');
});

app.use('/user', usesRouter);

app.use(defaultErrorHandler);
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
