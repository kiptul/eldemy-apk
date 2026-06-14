import { Injectable} from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';

declare const google: any;

const WEB_CLIENT_ID =
  '25668087734-k83acc3es2epk29r8vqb94lp42j3i4it.apps.googleusercontent.com';

@Injectable({
  providedIn: 'root',
})
export class GoogleAuthService {

  async signIn(): Promise<{ accessToken?: string; idToken?: string }> {
    if (Capacitor.isNativePlatform()) {
      return this.nativeSignIn();
    } else {
      const accessToken = await this.webSignIn();
      return { accessToken };
    }
  }

  private async nativeSignIn(): Promise<{ accessToken?: string; idToken?: string }> {
    const googleUser = await GoogleAuth.signIn();
    return {
      accessToken: googleUser.authentication?.accessToken,
      idToken: googleUser.authentication?.idToken,
    };
  }

  private webSignIn(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof google === 'undefined' || !google?.accounts?.oauth2) {
        reject(new Error('Google Identity Services belum dimuat. Silakan muat ulang halaman.'));
        return;
      }

      const tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: WEB_CLIENT_ID,
        scope: 'profile email',
        callback: (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
            return;
          }
          resolve(response.access_token);
        },
      });

      tokenClient.requestAccessToken({ prompt: 'select_account' });
    });
  }

  async signOut(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await GoogleAuth.signOut();
    }
  }
}
