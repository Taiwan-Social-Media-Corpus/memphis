import { CommandHandler, ICommandHandler, EventPublisher } from '@nestjs/cqrs';
import { CreateUserService } from '@memphis/corpus/application/services/users';
import { JwtService } from '@memphis/jwt';
import { CreateUserCommand } from './command';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly createUserService: CreateUserService,
    private readonly jwtService: JwtService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(command: CreateUserCommand) {
    const refreshToken = this.jwtService.generateRefreshToken();
    const userResult = await this.createUserService.execute({
      ...command,
      refreshToken,
    });

    if (userResult.isErr()) {
      throw userResult.getError();
    }

    return this.eventPublisher.mergeObjectContext(userResult.getValue());
  }
}
