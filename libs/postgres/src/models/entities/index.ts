import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type';
import User from './user.entity';
import Admin from './admin.entity';

const entities: EntityClassOrSchema[] = [User, Admin] as const;

export { User, Admin, entities };
