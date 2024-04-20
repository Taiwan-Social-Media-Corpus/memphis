import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Admin } from '@memphis/postgres/models/entities';

@Injectable()
class AdminRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly _adminRepository: Repository<Admin>,
  ) {}

  async exists(options: FindOneOptions<Admin>) {
    return this._adminRepository.count(options).then((count) => count > 0);
  }

  async findOne(options: FindOneOptions<Admin>) {
    return this._adminRepository.findOne(options);
  }

  async create(admin: Admin) {
    return this._adminRepository.save(admin);
  }

  async update(
    criteria: FindOptionsWhere<Admin>,
    partialEntity: QueryDeepPartialEntity<Admin>,
  ) {
    return this._adminRepository.update(criteria, partialEntity);
  }
}

export default AdminRepository;
