import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { User } from '@memphis/postgres/models/entities';

@Injectable()
class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async exists(options: FindOneOptions<User>) {
    return this._userRepository.count(options).then((count) => count > 0);
  }

  async findOne(options: FindOneOptions<User>) {
    return this._userRepository.findOne(options);
  }

  async create(admin: User) {
    return this._userRepository.save(admin);
  }

  async update(
    criteria: FindOptionsWhere<User>,
    partialEntity: QueryDeepPartialEntity<User>,
  ) {
    return this._userRepository.update(criteria, partialEntity);
  }
}

export default UserRepository;
