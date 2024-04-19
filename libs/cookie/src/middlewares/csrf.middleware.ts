import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import Definition from '@memphis/definition';
import { CsrfTokenService, CookieService } from '../services';

@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  constructor(
    private readonly cookieService: CookieService,
    private readonly csrfTokenService: CsrfTokenService,
  ) {}

  private verify(req: Request) {
    const cookies = req.context.getCookies();
    const csrfToken = this.cookieService.get(
      cookies,
      Definition.Cookies.csrfToken,
    );
    const hmac = req.header('X-Csrf-Token');
    if (!csrfToken || !hmac) return false;
    return this.csrfTokenService.verify(csrfToken, hmac);
  }

  use(req: Request, res: Response, next: NextFunction) {
    const ignoredMethods = new Set(['GET', 'HEAD', 'OPTIONS']);
    if (ignoredMethods.has(req.method)) {
      next();
    }

    const isValid = this.verify(req);
    if (!isValid) {
      throw new ForbiddenException('Invalid CSRF token');
    }

    next();
  }
}
