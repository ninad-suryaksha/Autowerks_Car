import 'dotenv/config';
import express from 'express';
import generateImagesHandler from './generate-images.js';
import generateVideoHandler from './generate-video.js';
import pollVideoHandler from './poll-video.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON bodies up to 50MB (for base64 images)
app.use(express.json({ limit: '50mb' }));

// CORS for development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

// API Routes
app.post('/api/generate-images', generateImagesHandler);
app.post('/api/generate-video', generateVideoHandler);
app.get('/api/poll-video', pollVideoHandler);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`API server running on http://localhost:${PORT}`);
});
