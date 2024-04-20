import { randomBytes } from 'crypto';
import { importJWK, SignJWT, decodeJwt, jwtVerify } from 'jose';
import { Injectable } from '@nestjs/common';
import { jwk } from './config';

type JwtPayload = {
  refreshToken: string;
  uid: string;
};

@Injectable()
export class JwtService {
  async sign(payload: JwtPayload) {
    const privateKey = await importJWK(jwk.privateKey);
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'EdDSA' })
      .setIssuedAt()
      .setIssuer('lope')
      .setAudience('ntu:gil:corpus')
      .setExpirationTime('30d')
      .sign(privateKey);
  }

  async verify<T extends Record<string, any>>(token: string) {
    try {
      const publicKey = await importJWK(jwk.publicKey);
      return await jwtVerify<JwtPayload & T>(token, publicKey, {
        issuer: 'lope',
        audience: 'ntu:gil:corpus',
      });
    } catch (error) {
      return null;
    }
  }

  decode<T extends Record<string, any>>(token: string) {
    try {
      return decodeJwt<JwtPayload & T>(token);
    } catch (error) {
      return null;
    }
  }

  generateRefreshToken() {
    return randomBytes(19).toString('base64');
  }
}
