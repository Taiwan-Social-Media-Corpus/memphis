import { CreateAdminService } from './admin/admin-creation.service';
import { GetAdminService } from './admin/admin-get.service';

const adminServices = [CreateAdminService, GetAdminService];

export { CreateAdminService, GetAdminService, adminServices };
