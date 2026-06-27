import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'me.geetprince.retro',
  appName: 'Retro',
  webDir: 'dist',

  server: {
    url: 'https://retro.geetprince.me',
    cleartext: false
  }
};

export default config;