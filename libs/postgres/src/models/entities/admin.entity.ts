import { Column, Entity } from 'typeorm';
import { PersonEntity } from './common/common.model';

@Entity('admins')
class Admin extends PersonEntity {
  constructor(args?: Partial<Admin>) {
    super();
    Object.assign(this, args);
  }

  @Column('int', { name: 'role_id' })
  roleId!: number;
}

export default Admin;
