import * as fs from 'fs';

export function getSecret() {
  try {
    return fs.readFileSync(__dirname + '/../../../backend/config/jwt-key-local.txt', { encoding: 'utf-8' });
  } catch (e) {
    return fs.readFileSync(__dirname + '/../../../backend/config/jwt-key.txt');
  }
}
