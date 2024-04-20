import { Request, Response } from 'express';
import {
  Controller,
  Post,
  Body,
  UsePipes,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateAdminCommand } from '@memphis/admin/application/use-cases/admin/commands';
import { AdminAggregate } from '@memphis/admin/domain/models/aggregate-root/admin';
import AdminMapper from '@memphis/admin/infrastructure/mappers/admin';
import { CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';
import { ZodValidationPipe } from '@memphis/dto/pipes';
import { JwtService } from '@memphis/jwt';
import { AdminRepository } from '@memphis/postgres/models/repositories';
import { createAdminSchema, CreateAdminDto } from './dto';

@Controller('admin')
class AdminController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly jwtService: JwtService,
    private readonly cookieService: CookieService,
    private readonly adminRepository: AdminRepository,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createAdminSchema))
  async signUp(
    @Body() createAdminDto: CreateAdminDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const hasEmail = await this.adminRepository.exists({
      where: { email: createAdminDto.email },
    });
    if (hasEmail) {
      throw new UnauthorizedException();
    }

    const adminEntity = await this.commandBus.execute<
      CreateAdminCommand,
      AdminAggregate
    >(new CreateAdminCommand(createAdminDto));

    const refreshToken = this.jwtService.generateRefreshToken();
    adminEntity.setRefreshToken(refreshToken);
    adminEntity.registerRefreshTokenUpdateEvent();
    adminEntity.commit();

    const jwt = await this.jwtService.sign({
      refreshToken: adminEntity.refreshToken,
      uid: adminEntity.id,
    });
    const cookies = req.context.getCookies();
    this.cookieService.set(cookies, Definition.Cookies.authToken, jwt, {
      signed: true,
    });

    const dto = AdminMapper.toDto(adminEntity);
    return res.status(201).json({ status: 'success', data: dto });
  }
}

export { AdminController };
