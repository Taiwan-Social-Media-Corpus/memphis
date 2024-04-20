import {
  Injectable,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserAggregate } from '@memphis/corpus/domain/models/aggregate-root/user';
import { UserRepository } from '@memphis/corpus/infrastructure/repositories';
import { ApplicationService } from '@memphis/domain/service';
import { Result, Ok, Err } from '@memphis/result';

type GetUserInput = {
  id?: string;
  email?: string;
};

type GetUserOutput = Promise<Ok<UserAggregate> | Err<HttpException>>;

@Injectable()
export class GetUserService
  implements ApplicationService<GetUserInput, GetUserOutput>
{
  constructor(private readonly userRepository: UserRepository) {}
  async execute(input: GetUserInput) {
    try {
      const userEntity = await this.userRepository.findOne(input);
      if (!userEntity) {
        return Result.Err(new NotFoundException('User not found'));
      }
      return Result.Ok(userEntity);
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}
