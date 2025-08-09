import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load .env files with Vite's prefix handling. All variables starting with
  // VITE_ will be exposed via import.meta.env.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      // Ensure Tailwind directives are properly processed.
      preprocessorOptions: {
        // Additional configuration can be placed here if needed in future.
      }
    }
  };
});