import fs from 'fs';
import path from 'path';
export const initFile = () => {
  if(!fs.existsSync(path.resolve('images')))
      fs.mkdirSync(path.resolve('images'));
}