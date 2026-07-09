import { Injectable } from '@angular/core';
import { SocialLogin } from '@capgo/capacitor-social-login';

const WEB_CLIENT_ID =
  '376612337093-hov5rl003cnj455eehfu3imi6q3b3qql.apps.googleusercontent.com';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {
  private initialized = false;

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    await SocialLogin.initialize({
      google: {
        webClientId: WEB_CLIENT_ID,
      },
    });
    this.initialized = true;
  }

  async signIn(): Promise<{ accessToken?: string; idToken?: string }> {
    await this.ensureInitialized();
    const res: any = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile'],
      },
    });
    const result = res?.result || {};
    return {
      accessToken: result.accessToken?.token,
      idToken: result.idToken,
    };
  }

  async signOut(): Promise<void> {
    try {
      await SocialLogin.logout({ provider: 'google' });
    } catch (e) {
      // ignore
    }
  }
}