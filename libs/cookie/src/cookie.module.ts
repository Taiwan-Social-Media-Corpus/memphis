import { Module } from '@nestjs/common';
import { CookieService, CsrfTokenService } from './services';

@Module({
  providers: [CookieService, CsrfTokenService],
  exports: [CookieService, CsrfTokenService],
})
export class CookieModule {}
