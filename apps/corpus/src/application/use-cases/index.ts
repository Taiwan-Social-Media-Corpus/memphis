import { CreateUserCommandHandler } from './user/commands/create';
import { CheckUserRefreshTokenQueryHandler } from './user/queries/refreshToken';

const cqrsHandlers = [
  CreateUserCommandHandler,
  CheckUserRefreshTokenQueryHandler,
] as const;

export { cqrsHandlers };
