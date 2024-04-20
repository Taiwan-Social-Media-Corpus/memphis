import { Request, Response } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CheckUserRefreshTokenQuery } from '@memphis/corpus/application/use-cases/user/queries';
import { UserAggregate } from '@memphis/corpus/domain/models/aggregate-root/user';
import { CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';
import { JwtService } from '@memphis/jwt';

@Controller('user/refresh')
class RefreshController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  @Post()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies = req.context.getCookies();
    const jwtCookie = cookies.get(Definition.Cookies.authToken, {
      signed: true,
    });
    if (!jwtCookie) {
      throw new UnauthorizedException();
    }

    const jwt = this.jwtService.decode(jwtCookie);
    if (jwt === null) {
      throw new UnauthorizedException();
    }

    const userEntity = await this.queryBus.execute<
      CheckUserRefreshTokenQuery,
      UserAggregate
    >(
      new CheckUserRefreshTokenQuery({
        id: jwt.uid,
        refreshToken: jwt.refreshToken,
      }),
    );
    const refreshToken = this.jwtService.generateRefreshToken();
    userEntity.setRefreshToken(refreshToken);
    userEntity.registerRefreshTokenUpdateEvent();
    userEntity.commit();

    const newJwt = await this.jwtService.sign({
      refreshToken,
      uid: userEntity.id,
    });
    this.cookieService.set(cookies, Definition.Cookies.authToken, newJwt, {
      signed: true,
    });
    return res.status(200).json({ status: 'success' });
  }
}

export { RefreshController };
