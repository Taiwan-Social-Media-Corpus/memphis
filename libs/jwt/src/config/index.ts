import { config } from '@memphis/config';

export const jwk = {
  publicKey: {
    crv: 'Ed25519',
    x: config.jwkPublicX,
    kty: 'OKP',
  },
  privateKey: {
    crv: 'Ed25519',
    d: config.jwkPrivateD,
    x: config.jwkPublicX,
    kty: 'OKP',
  },
} as const;
