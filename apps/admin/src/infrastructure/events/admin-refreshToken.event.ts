import { InternalServerErrorException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateAdminRefreshTokenEvent } from '@memphis/admin/domain/events';
import { AdminRepository } from '@memphis/postgres/models/repositories';

@EventsHandler(UpdateAdminRefreshTokenEvent)
export class UpdateAdminRefreshTokenEventHandler
  implements IEventHandler<UpdateAdminRefreshTokenEvent>
{
  constructor(private readonly adminRepository: AdminRepository) {}

  handle(event: UpdateAdminRefreshTokenEvent) {
    try {
      this.adminRepository.update(
        { id: event.id },
        { refreshToken: event.refreshToken },
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
