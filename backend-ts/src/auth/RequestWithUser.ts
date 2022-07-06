import { Request } from 'express';
import { User } from 'src/entities/User';
export interface RequestWithUser extends Request {
  user: User;
}
