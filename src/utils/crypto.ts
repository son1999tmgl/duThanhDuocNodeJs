import { createHash } from 'crypto';

function sha256(str: string): string {
  return createHash('sha256').update(str).digest('hex');
}

export function hasPassword256(password: string): string {
  return sha256(password + process.env.PASSWORD_SECRET);
}
