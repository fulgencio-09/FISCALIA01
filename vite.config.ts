import path from 'path';
// Import process to fix TS error: Property 'cwd' does not exist on type 'Process' on line 20
import process from 'process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      // Removed define block for process.env.API_KEY as per Gemini API guidelines.
      // The API key is assumed to be pre-configured, valid, and accessible in the execution context.
      resolve: {
        alias: {
          /* Use process.cwd() instead of __dirname to avoid errors in ESM environments where __dirname is not defined */
          '@': path.resolve(process.cwd(), '.'),
        }
      }
    };
});