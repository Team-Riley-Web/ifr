import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import tailwindcss from '@tailwindcss/vite';

// astro dev only loads .env into import.meta.env, not process.env, but our
// server code (R2 client, etc.) reads process.env to match Netlify's runtime.
try {
  process.loadEnvFile();
} catch {}

export default defineConfig({
  output: 'server',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
});
