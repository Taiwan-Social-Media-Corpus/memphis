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

abstract class DefaultCUIDEntity extends TimeEntity {
  @CUIDColumn({ primary: true })
  id!: string;

  @BeforeInsert()
  initPrimaryKey() {
    if (!this.id) {
      this.id = createId();
    }
  }
}

export { CreateTimeEntity, TimeEntity, DefaultEntity, DefaultCUIDEntity };
