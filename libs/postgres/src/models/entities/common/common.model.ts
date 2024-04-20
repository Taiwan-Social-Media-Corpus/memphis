import { IsEmail } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import { createId } from '@paralleldrive/cuid2';
import CUIDColumn from './common.column';

abstract class CreateTimeEntity {
  @Index()
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt!: Date;
}

abstract class TimeEntity extends CreateTimeEntity {
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt!: Date;
}

abstract class DefaultEntity extends TimeEntity {
  @Column({ primary: true, type: 'uuid' })
  id!: string;
}

abstract class PersonEntity extends TimeEntity {
  @CUIDColumn({ primary: true })
  id!: string;

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

  @BeforeInsert()
  initPrimaryKey() {
    if (!this.id) {
      this.id = createId();
    }
  }
}

export { CreateTimeEntity, TimeEntity, DefaultEntity, PersonEntity };
