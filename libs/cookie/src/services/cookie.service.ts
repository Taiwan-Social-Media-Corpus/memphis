import type Cookies from 'cookies';
import type { Response } from 'express';
import { Injectable } from '@nestjs/common';
import { config } from '@memphis/config';

const setOptions: Cookies.SetOption = {
  httpOnly: true,
  secure: config.nodeEnv === 'production',
  sameSite: 'strict',
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  signed: false,
};

@Injectable()
export class CookieService {
  set(
    cookies: Cookies,
    name: string,
    val: string,
    options?: Cookies.SetOption,
  ) {
    const cookieOptions = { ...setOptions, ...options };
    return cookies.set(name, val, cookieOptions);
  }

  get(cookies: Cookies, name: string, signed: boolean = false) {
    return cookies.get(name, { signed });
  }

  remove(res: Response, name: string | string[]) {
    if (Array.isArray(name)) {
      name.forEach((cookieName) => {
        res.clearCookie(cookieName);
      });
    } else {
      res.clearCookie(name);
    }
  }
}
