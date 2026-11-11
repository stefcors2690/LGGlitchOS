import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: './',
  build: mode === 'webos' ? {
    target: 'chrome132',
    cssTarget: 'chrome132',
    outDir: 'dist-webos',
    modulePreload: false,
    cssCodeSplit: false,
    rolldownOptions: { output: { format: 'iife', codeSplitting: false } },
  } : undefined,
}));
