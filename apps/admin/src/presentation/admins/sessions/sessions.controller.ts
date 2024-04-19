import { Response, Request } from 'express';
import { UseGuards, Controller, Post, Delete, Body, UsePipes, Res, Req } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { LoginQuery } from '@memphis/admin/application/use-cases/admin/queries';
import { AdminGuard } from '@memphis/admin/application/services/guards/admin.guard';
import AdminMapper from '@memphis/admin/infrastructure/mappers/admin';
import type { AdminAggregate } from '@memphis/admin/domain/models/aggregate-root/admin';
import { CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';
import { ZodValidationPipe } from '@memphis/dto/pipes';
import { JwtService } from '@memphis/jwt';
import { LoginAdminDto, loginAdminSchema } from './login.dto';

@Controller('admin/sessions')
class SessionsController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(loginAdminSchema))
  async login(@Body() loginAdminDto: LoginAdminDto, @Req() req: Request, @Res() res: Response) {
    const adminEntity = await this.queryBus.execute<LoginQuery, AdminAggregate>(
      new LoginQuery(loginAdminDto),
    );

    const refreshToken = this.jwtService.generateRefreshToken();
    adminEntity.setRefreshToken(refreshToken);
    adminEntity.registerRefreshTokenUpdateEvent();
    adminEntity.commit();

    const dto = AdminMapper.toDto(adminEntity);
    const jwt = await this.jwtService.sign({ refreshToken, uid: dto.id });
    const cookies = req.context.getCookies();
    this.cookieService.set(cookies, Definition.Cookies.authToken, jwt, { signed: true });
    return res.status(200).json({ status: 'success', data: dto });
  }

  @Delete()
  @UseGuards(AdminGuard)
  async logout(@Res() res: Response) {
    this.cookieService.remove(res, [Definition.Cookies.authToken, Definition.Cookies.authTokenSig]);
    return res.status(204).json();
  }
}

export { SessionsController };
