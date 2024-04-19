import { UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQueryHandler, EventPublisher } from '@nestjs/cqrs';
import { GetAdminService } from '@memphis/admin/application/services/admins';
import { LoginQuery } from './query';

@QueryHandler(LoginQuery)
export class LoginQueryHandler implements IQueryHandler<LoginQuery> {
  constructor(
    private readonly getAdminService: GetAdminService,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(query: LoginQuery) {
    const adminResult = await this.getAdminService.execute({
      email: query.email,
    });

    if (adminResult.isErr()) {
      throw new UnauthorizedException();
    }

    const adminEntity = adminResult.getValue();
    const pwdResult = await adminEntity.validatePassword(query.password);
    if (pwdResult.isErr()) {
      throw pwdResult.getError();
    }

    return this.eventPublisher.mergeObjectContext(adminEntity);
  }
}
