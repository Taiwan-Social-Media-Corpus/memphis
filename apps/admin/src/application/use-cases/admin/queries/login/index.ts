import { UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { LoginQuery } from './query';
import { AdminRepository } from '@memphis/admin/infrastructure/repositories';

@QueryHandler(LoginQuery)
export class LoginQueryHandler implements IQueryHandler<LoginQuery> {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(query: LoginQuery) {
    const adminEntity = await this.adminRepository.findOneByEmail(query.email);
    if (adminEntity === null) {
      throw new UnauthorizedException();
    }

    const pwdResult = await adminEntity.validatePassword(query.password);
    if (pwdResult.isErr()) {
      throw pwdResult.getError();
    }

    return adminEntity;
  }
}
