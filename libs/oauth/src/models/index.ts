import { google } from 'googleapis';
import { config } from '@memphis/config';

const { serverURL, googleOAuthClientId, googleOAuthClientSecret } = config;

const OAuthClient = new google.auth.OAuth2({
  redirectUri: `${serverURL}/v1/user/auth/callback`,
  clientSecret: googleOAuthClientSecret,
  clientId: googleOAuthClientId,
});

export default OAuthClient;
