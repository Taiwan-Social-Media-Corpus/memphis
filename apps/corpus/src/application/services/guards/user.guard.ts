import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserRepository } from '@memphis/corpus/infrastructure/repositories';
import { CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';
import { JwtService } from '@memphis/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly cookieService: CookieService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const cookies = request.context.getCookies();
    const jwtCookie = cookies.get(Definition.Cookies.authToken, {
      signed: true,
    });
    if (!jwtCookie) {
      return false;
    }

    const jwt = await this.jwtService.verify(jwtCookie);
    if (!jwt) {
      throw new UnauthorizedException('JWT expired');
    }
    const userEntity = await this.userRepository.findOne({
      id: jwt.payload.uid,
    });
    if (!userEntity || userEntity.refreshToken !== jwt.payload.refreshToken) {
      this.cookieService.remove(response, [
        Definition.Cookies.authToken,
        Definition.Cookies.authTokenSig,
      ]);
      return false;
    }

    request.context = {
      ...request.context,
      getUser: () => userEntity,
    };
    return true;
  }
}
