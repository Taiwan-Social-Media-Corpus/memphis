import { Controller, Get, Res } from '@nestjs/common';
import { CsrfTokenService, CsrfCookieService } from '@memphis/cookie';
import { Response } from 'express';

@Controller('_ping')
class CsrfController {
  constructor(
    private readonly csrfTokenService: CsrfTokenService,
    private readonly csrfCookieService: CsrfCookieService,
  ) {}
  @Get()
  async signUp(@Res() res: Response) {
    const csrfToken = this.csrfTokenService.generate();
    const hmac = this.csrfTokenService.hmac(csrfToken);
    res.header('X-Csrf-Token', hmac);
    this.csrfCookieService.set(csrfToken, res);
    return res.status(204).json();
  }
}

export { CsrfController };
