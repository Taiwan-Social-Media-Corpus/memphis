import { UnauthorizedException } from '@nestjs/common';
import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { config } from '@memphis/config';
import { JwtService } from '@memphis/jwt';
import { CreateAdminService } from '@memphis/admin/application/services/admins/admin/admin-creation.service';
import { CreateAdminCommand } from './command';

@CommandHandler(CreateAdminCommand)
export class CreateAdminCommandHandler implements ICommandHandler<CreateAdminCommand> {
  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly jwtService: JwtService,
    private readonly createAdminService: CreateAdminService,
  ) {}

  async execute(command: CreateAdminCommand) {
    const { token, ...adminDto } = command;
    if (config.adminToken !== token) {
      throw new UnauthorizedException('Invalid token');
    }

    const refreshToken = this.jwtService.generateRefreshToken();
    const adminResult = await this.createAdminService.execute({
      ...adminDto,
      roleId: 2,
      refreshToken,
    });

    if (adminResult.isErr()) {
      throw adminResult.getError();
    }

    return this.eventPublisher.mergeObjectContext(adminResult.getValue());
  }
}
