import type Cookies from 'cookies';
import type { AdminAggregate } from '@memphis/admin/domain/models/aggregate-root/admin';

declare global {
  namespace Express {
    interface Request {
      context: {
        getAdmin: () => AdminAggregate;
        getCookies: () => Cookies;
      };
    }
  }
}

export {};
