import { Injectable } from '@nestjs/common';
import { config } from '@memphis/config';
import { createHmac, randomBytes } from 'crypto';

@Injectable()
export class CsrfTokenService {
  get secrets(): string | string[] {
    return Array.isArray(config.cookieSecret)
      ? config.cookieSecret
      : [config.cookieSecret];
  }

  hmac(csrfToken: string, secret: string = this.secrets[0]) {
    return createHmac('sha1', config.cookieHmacSecret)
      .update(`${csrfToken}${secret}`)
      .digest('hex');
  }

  generate(size: number = 12) {
    return randomBytes(size).toString('hex');
  }

  verify(token: string, hmac: string) {
    if (typeof token !== 'string' || typeof hmac !== 'string') return false;

    const secrets = Array.isArray(config.cookieSecret)
      ? config.cookieSecret
      : [config.cookieSecret];

    for (const secret of secrets) {
      const expected = this.hmac(token, secret);
      if (hmac === expected) return true;
    }

    return false;
  }
}
