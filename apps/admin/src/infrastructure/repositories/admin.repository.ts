import { FindOneOptions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Admin } from '@memphis/postgres/models/entities';
import { AdminRepository as _AdminRepository } from '@memphis/postgres/models/repositories';
import AdminMapper from '../mappers/admin';

@Injectable()
class AdminRepository {
  constructor(private readonly adminRepository: _AdminRepository) {}

  async findOne(options: FindOneOptions<Admin>) {
    const admin = await this.adminRepository.findOne(options);
    if (!admin) {
      return admin;
    }
    return AdminMapper.toDomain(admin);
  }

  async save(admin: Admin) {
    this.adminRepository.create(admin);
    return AdminMapper.toDomain(admin);
  }
}

export default AdminRepository;
