import {
  Injectable,
  HttpException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AdminAggregate } from '@memphis/admin/domain/models/aggregate-root/admin';
import { AdminRepository } from '@memphis/admin/infrastructure/repositories';
import { ApplicationService } from '@memphis/domain/service';
import { Result, Ok, Err } from '@memphis/result';

type GetAdminInput = {
  id?: string;
  email?: string;
};

type GetAdminOutput = Promise<Ok<AdminAggregate> | Err<HttpException>>;

@Injectable()
export class GetAdminService
  implements ApplicationService<GetAdminInput, GetAdminOutput>
{
  constructor(private readonly adminRepository: AdminRepository) {}
  async execute(input: GetAdminInput) {
    try {
      const adminEntity = await this.adminRepository.findOne({
        where: input,
      });

      if (!adminEntity) {
        return Result.Err(new NotFoundException('User not found'));
      }

      return Result.Ok(adminEntity);
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}
