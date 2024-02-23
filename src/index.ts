import express from 'express';
import usesRouter from './routers/users.routes';
import { databaseService } from './services/database.services';
const app = express();
const PORT = 3000;
app.use(express.json());

app.get('/', (req, res) => {
  res.send('');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
databaseService.connect();
app.use('/user', usesRouter);
