import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AdminRepository } from '@memphis/admin/infrastructure/repositories';
import { CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';
import { JwtService } from '@memphis/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly adminRepository: AdminRepository,
    private readonly cookieService: CookieService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const cookies = request.context.getCookies();
    const jwtCookie = this.cookieService.get(
      cookies,
      Definition.Cookies.authToken,
      true,
    );
    if (!jwtCookie) {
      return false;
    }

    const jwt = await this.jwtService.verify(jwtCookie);
    if (!jwt) {
      throw new UnauthorizedException('JWT expired');
    }

    const admin = await this.adminRepository.findOne({
      where: { id: jwt.payload.uid },
    });
    if (!admin) {
      this.cookieService.remove(response, [
        Definition.Cookies.authToken,
        Definition.Cookies.authTokenSig,
      ]);
      return false;
    }

    if (admin.refreshToken !== jwt.payload.refreshToken) {
      this.cookieService.remove(response, [
        Definition.Cookies.authToken,
        Definition.Cookies.authTokenSig,
      ]);
      return false;
    }

    request.context = {
      ...request.context,
      getAdmin: () => admin,
    };
    return true;
  }
}
