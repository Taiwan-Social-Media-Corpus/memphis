import { UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQueryHandler, EventPublisher } from '@nestjs/cqrs';
import { AdminRepository } from '@memphis/admin/infrastructure/repositories';
import { LoginQuery } from './query';

@QueryHandler(LoginQuery)
export class LoginQueryHandler implements IQueryHandler<LoginQuery> {
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(query: LoginQuery) {
    const adminEntity = await this.adminRepository.findOneByEmail(query.email);
    if (adminEntity === null) {
      throw new UnauthorizedException();
    }

    const pwdResult = await adminEntity.validatePassword(query.password);
    if (pwdResult.isErr()) {
      throw pwdResult.getError();
    }

    return this.eventPublisher.mergeObjectContext(adminEntity);
  }
}
