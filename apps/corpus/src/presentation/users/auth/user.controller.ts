import { Request, Response } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { Controller, Get, Req, Res, Query } from '@nestjs/common';
import { config } from '@memphis/config';
import { CreateUserCommand } from '@memphis/corpus/application/use-cases/user/commands';
import type { UserAggregate } from '@memphis/corpus/domain/models/aggregate-root/user';
import { UserRepository } from '@memphis/corpus/infrastructure/repositories';
import { CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';
import { JwtService } from '@memphis/jwt';
import { OAuthService } from '@memphis/oauth';

@Controller('user/auth')
class UserAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
    private readonly userRepository: UserRepository,
  ) {}

  @Get('url')
  async getAuthUrl(@Req() req: Request) {
    const cookies = req.context.getCookies();
    const hasJWT = cookies.get(Definition.Cookies.authToken, { signed: true });
    if (hasJWT) {
      return { success: true, url: config.clientURL };
    }
    const url = this.oauthService.getUrl();
    return { status: 'success', url };
  }

  @Get('callback')
  async callback(
    @Query() query: { code?: string; error?: string },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { code, error } = query;
    if (error || !code) {
      return res.redirect(config.clientURL);
    }

    const userData = await this.oauthService.getUser(code);
    if (userData === null) {
      return res.redirect(config.clientURL);
    }

    let userEntity = await this.userRepository.findOne({
      email: userData.email,
    });
    if (userEntity === null) {
      userEntity = await this.commandBus.execute<
        CreateUserCommand,
        UserAggregate
      >(
        new CreateUserCommand({
          email: userData.email,
          firstName: userData.given_name ?? '',
          lastName: userData.family_name ?? '',
          picture: userData.picture ?? '',
        }),
      );
    } else {
      const refreshToken = this.jwtService.generateRefreshToken();
      userEntity.setRefreshToken(refreshToken);
      userEntity.registerRefreshTokenUpdateEvent();
      userEntity.commit();
    }

    const jwt = await this.jwtService.sign({
      refreshToken: userEntity.refreshToken,
      uid: userEntity.id,
    });
    const cookies = req.context.getCookies();
    this.cookieService.set(cookies, Definition.Cookies.authToken, jwt, {
      signed: true,
    });
    return res.redirect(config.clientURL);
  }
}

export { UserAuthController };
