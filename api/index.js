// Vercel serverless entry. Static assets in public/ are served by Vercel directly;
// every other path is rewritten here (vercel.json). Runs in STAGING mode unless RSD_MODE=production.
import { createApp } from '../src/server.js';

const app = createApp();
export default function handler(req, res) {
  return app.handler(req, res);
}
