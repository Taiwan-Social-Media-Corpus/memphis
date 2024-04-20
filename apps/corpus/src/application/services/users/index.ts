import CreateUserService from './user/user-create.service';
import { GetUserService } from './user/user-get.service';

const userServices = [CreateUserService, GetUserService];

export { CreateUserService, GetUserService, userServices };
