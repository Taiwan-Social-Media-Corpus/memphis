import { Request, Response } from 'express';
import { Delete, Controller, Req, Res, UseGuards, Get } from '@nestjs/common';
import { CookieService } from '@memphis/cookie';
import { UserGuard } from '@memphis/corpus/application/services/guards/user.guard';
import { UserMapper } from '@memphis/corpus/infrastructure/mappers';
import Definition from '@memphis/definition';
import { JwtService } from '@memphis/jwt';

@UseGuards(UserGuard)
@Controller('user/sessions')
class SessionsController {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  @Get()
  get(@Req() req: Request) {
    const userEntity = req.context.getUser();
    const dto = UserMapper.toDto(userEntity);
    return { status: 'success', data: dto };
  }

  @Delete()
  async delete(@Req() req: Request, @Res() res: Response) {
    const userEntity = req.context.getUser();
    const refreshToken = this.jwtService.generateRefreshToken();
    userEntity.setRefreshToken(refreshToken);
    userEntity.registerRefreshTokenUpdateEvent();
    userEntity.commit();

    this.cookieService.remove(res, [
      Definition.Cookies.authToken,
      Definition.Cookies.authTokenSig,
    ]);
    return res.status(204).json();
  }
}

export { SessionsController };
