import express, { NextFunction, Request, Response } from 'express';
import usesRouter from './routers/users.routes';
import { databaseService } from './services/database.services';
const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('');
});

databaseService.connect();
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Lỗi r');

  res.status(400).json({ error: err.message });
});
app.use('/user', usesRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
