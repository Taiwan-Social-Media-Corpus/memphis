import { UnauthorizedException } from '@nestjs/common';
import { QueryHandler, IQueryHandler } from '@nestjs/cqrs';
import { GetUserService } from '@memphis/corpus/application/services/users';
import { CheckUserRefreshTokenQuery } from './query';

@QueryHandler(CheckUserRefreshTokenQuery)
export class CheckUserRefreshTokenQueryHandler
  implements IQueryHandler<CheckUserRefreshTokenQuery>
{
  constructor(private readonly getUserService: GetUserService) {}

  async execute(query: CheckUserRefreshTokenQuery) {
    const userResult = await this.getUserService.execute({
      id: query.id,
    });
    if (userResult.isErr()) {
      throw new UnauthorizedException();
    }

    const userEntity = userResult.getValue();
    if (userEntity.refreshToken !== query.refreshToken) {
      throw new UnauthorizedException();
    }

    return userEntity;
  }
}
