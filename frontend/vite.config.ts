import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig} from 'vite';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  // Keep frontend aliases and development server settings centralized for Vite and TypeScript resolution.
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(configDirectory, 'src'),
        '@components': path.resolve(configDirectory, 'src/components'),
        '@features': path.resolve(configDirectory, 'src/features'),
        '@services': path.resolve(configDirectory, 'src/services'),
        '@hooks': path.resolve(configDirectory, 'src/hooks'),
        '@utils': path.resolve(configDirectory, 'src/utils'),
        '@constants': path.resolve(configDirectory, 'src/constants'),
        '@types': path.resolve(configDirectory, 'src/types'),
      },
    },
    server: {
      port: 3000,
    },
  };
});
