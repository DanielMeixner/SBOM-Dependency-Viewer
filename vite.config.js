import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use VITE_ELECTRON env var to switch base path
const isElectron = process.env.VITE_ELECTRON === 'true';

export default defineConfig({
  plugins: [react()],
  base: isElectron ? './' : '/sbomdepsviewer/',
  build: {
    outDir: 'dist',
  },
  server: {
    open: true,
  },
});
