import { Injectable } from '@nestjs/common';
import OAuthClient from './models';
import { OAuthReturnedData } from './types';

@Injectable()
export class OAuthService {
  getUrl() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];
    return OAuthClient.generateAuthUrl({
      scope: scopes,
      access_type: 'offline',
    });
  }

  async getUser(code: string) {
    try {
      const { tokens } = await OAuthClient.getToken(code);
      OAuthClient.setCredentials(tokens);
      const result = await OAuthClient.request<OAuthReturnedData>({
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
      });
      if (!result || !result.data) {
        return null;
      }
      return result.data;
    } catch (error) {
      return null;
    }
  }
}
