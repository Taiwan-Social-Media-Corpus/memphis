import Cookies from 'cookies';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { config } from '@memphis/config';

@Injectable()
export class CookieMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const secrets = Array.isArray(config.cookieSignatureSecret)
      ? config.cookieSignatureSecret
      : [config.cookieSignatureSecret];

    req.context = {
      ...req.context,
      getCookies: () => new Cookies(req, res, { keys: secrets }),
    };
    next();
  }
}
