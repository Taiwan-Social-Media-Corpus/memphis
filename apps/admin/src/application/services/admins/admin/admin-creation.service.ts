import {
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { createId } from '@paralleldrive/cuid2';
import {
  AdminRoleVO,
  AdminEmailVO,
  AdminPasswordVO,
} from '@memphis/admin/domain/models/value-object';
import { AdminAggregate } from '@memphis/admin/domain/models/aggregate-root/admin';
import AdminMapper from '@memphis/admin/infrastructure/mappers/admin';
import { AdminRepository } from '@memphis/admin/infrastructure/repositories';
import { ApplicationService } from '@memphis/domain/service';
import { Result, Ok, Err } from '@memphis/result';

type CreateAdminInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: number;
  refreshToken: string;
};

type CreateAdminOutput = Promise<Ok<AdminAggregate> | Err<HttpException>>;

@Injectable()
export class CreateAdminService
  implements ApplicationService<CreateAdminInput, CreateAdminOutput>
{
  constructor(private readonly adminRepository: AdminRepository) {}
  async execute(input: CreateAdminInput) {
    const cuid = createId();
    const password = await AdminPasswordVO.createHash({
      value: input.password,
    });
    const adminEntity = AdminAggregate.create(cuid, {
      firstName: input.firstName,
      lastName: input.lastName,
      email: AdminEmailVO.create({ value: input.email }),
      password,
      role: AdminRoleVO.create({ value: input.roleId }) as AdminRoleVO,
      refreshToken: input.refreshToken,
      disabled: false,
    });

    const adminDao = AdminMapper.toPersistence(adminEntity);
    try {
      return Result.Ok(await this.adminRepository.save(adminDao));
    } catch (error) {
      return Result.Err(new InternalServerErrorException());
    }
  }
}
