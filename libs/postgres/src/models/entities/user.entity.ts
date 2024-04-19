import { Entity } from 'typeorm';
import { PersonEntity } from './common/common.model';

@Entity('users')
class User extends PersonEntity {
  constructor(args?: Partial<User>) {
    super();
    Object.assign(this, args);
  }
}

export default User;
