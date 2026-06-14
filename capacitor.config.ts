import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.eldemy.student',
  appName: 'Eldemy',
  webDir: 'www',
  plugins: {
    GoogleAuth: {
      scopes: ['profile', 'email'],
      // Web Client ID - digunakan saat ionic serve di browser
      clientId:
        '25668087734-k83acc3es2epk29r8vqb94lp42j3i4it.apps.googleusercontent.com',
      // Server Client ID - digunakan native Android untuk request token ke backend
      serverClientId:
        '25668087734-k83acc3es2epk29r8vqb94lp42j3i4it.apps.googleusercontent.com',
      forceCodeForRefreshToken: true,
    },
  },
};

export default config;
