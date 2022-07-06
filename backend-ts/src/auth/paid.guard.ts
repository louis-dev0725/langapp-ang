import { Injectable, CanActivate, ExecutionContext, HttpException } from '@nestjs/common';

@Injectable()
export class PaidGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();
    let paid = user?.paidUntilDateTime && new Date(user.paidUntilDateTime) > new Date();
    if (!paid) {
      throw new HttpException('Payment required to continue using the service.', 402);
    }
    return paid;
  }
}
