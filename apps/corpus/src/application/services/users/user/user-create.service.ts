import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import { UserAggregate } from '@memphis/corpus/domain/models/aggregate-root/user';
import { UserEmailVO } from '@memphis/corpus/domain/models/value-object';
import { UserMapper } from '@memphis/corpus/infrastructure/mappers';
import UserRepository from '@memphis/corpus/infrastructure/repositories/user.repository';
import { ApplicationService } from '@memphis/domain/service';
import { Result, Ok, Err } from '@memphis/result';

type CreateUserInput = {
  firstName: string;
  lastName: string;
  email: string;
  picture: string;
  refreshToken: string;
};

type CreateUserOutput = Promise<Ok<UserAggregate> | Err<HttpException>>;

@Injectable()
class CreateUserService
  implements ApplicationService<CreateUserInput, CreateUserOutput>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(input: CreateUserInput) {
    const cuid = createId();
    const userEntity = UserAggregate.create(cuid, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: UserEmailVO.create({ value: input.email }),
      picture: input.picture,
      refreshToken: input.refreshToken,
      disabled: false,
    });

    const userDao = UserMapper.toPersistence(userEntity);
    try {
      return Result.Ok(await this.userRepository.save(userDao));
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}

export default CreateUserService;
