import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import 'dotenv/config';

import generateImagesHandler from './api/generate-images.js';
import generateVideoHandler from './api/generate-video.js';
import pollVideoHandler from './api/poll-video.js';

function expressApiPlugin() {
  return {
    name: 'express-api-plugin',
    configureServer(server) {
      const app = express();

      app.use(express.json({ limit: '50mb' }));

      app.post('/api/generate-images', generateImagesHandler);
      app.post('/api/generate-video', generateVideoHandler);
      app.get('/api/poll-video', pollVideoHandler);

      app.get('/api/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
      });

      // Mount the express app on the vite server
      server.middlewares.use(app);
    }
  };
}

export default defineConfig({
  plugins: [react(), expressApiPlugin()],
  server: {
    port: 5173,
  },
});
