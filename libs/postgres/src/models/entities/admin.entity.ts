import { IsEmail } from 'class-validator';
import { Column, Entity, Index } from 'typeorm';
import { DefaultCUIDEntity } from './common/common.model';

@Entity('admins')
class Admin extends DefaultCUIDEntity {
  constructor(args?: Partial<Admin>) {
    super();
    Object.assign(this, args);
  }

  @Column('varchar', { name: 'first_name' })
  firstName!: string;

  @Column('varchar', { name: 'last_name' })
  lastName!: string;

  @Index()
  @Column('text', { unique: true })
  @IsEmail()
  email!: string;

  @Column('text', { name: 'refresh_token' })
  refreshToken!: string;

  @Column('varchar')
  password!: string;

  @Column('boolean', { default: false })
  disabled!: boolean;

  @Column('int', { name: 'role_id' })
  roleId!: number;
}

export default Admin;
