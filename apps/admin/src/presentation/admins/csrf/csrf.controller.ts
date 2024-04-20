import { Request, Response } from 'express';
import { Controller, Get, Req, Res } from '@nestjs/common';
import { CsrfTokenService, CookieService } from '@memphis/cookie';
import Definition from '@memphis/definition';

@Controller('_ping')
class CsrfController {
  constructor(
    private readonly csrfTokenService: CsrfTokenService,
    private readonly cookieService: CookieService,
  ) {}
  @Get()
  async signUp(@Req() req: Request, @Res() res: Response) {
    const csrfToken = this.csrfTokenService.generate();
    const hmac = this.csrfTokenService.hmac(csrfToken);
    res.header('X-Csrf-Token', hmac);

    const cookies = req.context.getCookies();
    this.cookieService.set(cookies, Definition.Cookies.csrfToken, csrfToken, {
      expires: undefined,
      sameSite: undefined,
    });
    return res.status(204).json();
  }
}

export { CsrfController };
