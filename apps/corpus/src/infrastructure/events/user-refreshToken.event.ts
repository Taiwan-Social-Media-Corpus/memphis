import { InternalServerErrorException } from '@nestjs/common';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UpdateUserRefreshTokenEvent } from '@memphis/corpus/domain/events';
import { UserRepository } from '@memphis/postgres';

@EventsHandler(UpdateUserRefreshTokenEvent)
export class UpdateUserRefreshTokenEventHandler
  implements IEventHandler<UpdateUserRefreshTokenEvent>
{
  constructor(private readonly userRepository: UserRepository) {}

  handle(event: UpdateUserRefreshTokenEvent) {
    try {
      this.userRepository.update(
        { id: event.id },
        { refreshToken: event.refreshToken },
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
