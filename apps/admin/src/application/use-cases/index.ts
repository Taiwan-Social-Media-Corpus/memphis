import { CreateAdminCommandHandler } from './admin/commands/create';
import { LoginQueryHandler } from './admin/queries/login';
import { CheckAdminRefreshTokenQueryHandler } from './admin/queries/refreshToken';

export const cqrsHandlers = [
  CreateAdminCommandHandler,
  LoginQueryHandler,
  CheckAdminRefreshTokenQueryHandler,
] as const;
