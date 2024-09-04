import { Observable } from 'rxjs';

import { ERROR_MSG } from '@utils/responses';

import {
  CanActivate,
  ConflictException,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  private readonly allowedRole: string;
  constructor(role: string) {
    this.allowedRole = role;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new NotFoundException(ERROR_MSG.userNotFound);
    }
    if (request.user.role === this.allowedRole) {
      return true;
    } else {
      throw new ConflictException(ERROR_MSG.denied);
    }
  }
}

export const RoleGuard = (role: string) => new AuthRoleGuard(role);
