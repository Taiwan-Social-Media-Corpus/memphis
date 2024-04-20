import { Request, Response } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import {
  Controller,
  Post,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { CheckAdminRefreshTokenQuery } from '@memphis/admin/application/use-cases/admin/queries';
import { AdminAggregate } from '@memphis/admin/domain/models/aggregate-root/admin';
import { CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';
import { JwtService } from '@memphis/jwt';

@Controller('admin/refresh')
class RefreshController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  @Post()
  async refresh(@Req() req: Request, @Res() res: Response) {
    const cookies = req.context.getCookies();
    const jwtCookie = this.cookieService.get(
      cookies,
      Definition.Cookies.authToken,
      true,
    );
    if (!jwtCookie) {
      throw new UnauthorizedException();
    }

    const jwt = this.jwtService.decode(jwtCookie);
    if (jwt === null) {
      throw new UnauthorizedException();
    }

    const adminEntity = await this.queryBus.execute<
      CheckAdminRefreshTokenQuery,
      AdminAggregate
    >(
      new CheckAdminRefreshTokenQuery({
        id: jwt.uid,
        refreshToken: jwt.refreshToken,
      }),
    );
    const refreshToken = this.jwtService.generateRefreshToken();
    adminEntity.setRefreshToken(refreshToken);
    adminEntity.registerRefreshTokenUpdateEvent();
    adminEntity.commit();

    const newJwt = await this.jwtService.sign({
      refreshToken,
      uid: adminEntity.id,
    });
    this.cookieService.set(cookies, Definition.Cookies.authToken, newJwt, {
      signed: true,
    });
    return res.status(200).json({ status: 'success' });
  }
}

export { RefreshController };
