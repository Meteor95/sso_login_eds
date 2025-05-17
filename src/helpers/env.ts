import { readFileSync } from 'fs';
import { join } from 'path';


export const env = {
  RSA_PRIVATE_KEY: readFileSync(join(process.cwd(), process.env.RSA_PRIVATE_KEY_PATH!), 'utf-8'),
  RSA_PUBLIC_KEY: readFileSync(join(process.cwd(), process.env.RSA_PUBLIC_KEY_PATH!), 'utf-8'),
};
