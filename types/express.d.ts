import type Cookies from 'cookies';
import type { AdminAggregate } from '@memphis/admin/domain/models/aggregate-root/admin';
import type { UserAggregate } from '@memphis/corpus/domain/models/aggregate-root/user';

declare global {
  namespace Express {
    interface Request {
      context: {
        getAdmin: () => AdminAggregate;
        getUser: () => UserAggregate;
        getCookies: () => Cookies;
      };
    }
  }
}

export {};
