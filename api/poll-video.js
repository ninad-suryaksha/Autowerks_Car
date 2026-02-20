/**
 * GET /api/poll-video?predictionId=<id>
 * Polls the status of a Replicate Veo 3.1 video generation prediction
 *
 * Uses the Replicate API predictions.get endpoint:
 * https://replicate.com/docs/topics/predictions/create-a-prediction
 *
 * Returns: { status: 'pending'|'completed'|'failed', videoUrl?: string, progress?: number }
 *
 * Replicate statuses: starting → processing → succeeded | failed | canceled
 * When succeeded, prediction.output contains the video URL (served via Replicate CDN).
 */
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function pollVideoHandler(req, res) {
    try {
        const { predictionId } = req.query;

        if (!predictionId) {
            return res.status(400).json({ error: 'Missing predictionId' });
        }

        if (!process.env.REPLICATE_API_TOKEN) {
            return res.status(500).json({
                error: 'REPLICATE_API_TOKEN not configured.',
            });
        }

        const prediction = await replicate.predictions.get(predictionId);

        // Map Replicate statuses to our frontend-expected format
        switch (prediction.status) {
            case 'succeeded': {
                // Replicate output for video models is typically a URL string or array
                let videoUrl = null;

                if (typeof prediction.output === 'string') {
                    videoUrl = prediction.output;
                } else if (Array.isArray(prediction.output) && prediction.output.length > 0) {
                    videoUrl = prediction.output[0];
                }

                if (videoUrl) {
                    console.log('[Veo 3.1 Poll] ✅ Video ready:', videoUrl);
                    return res.json({
                        status: 'completed',
                        videoUrl: videoUrl,
                        progress: 100,
                    });
                }

                console.error('[Veo 3.1 Poll] Succeeded but no output found:', JSON.stringify(prediction, null, 2));
                return res.json({
                    status: 'failed',
                    progress: 0,
                });
            }

            case 'failed':
            case 'canceled': {
                console.error('[Veo 3.1 Poll] Prediction failed/canceled:', prediction.error || prediction.status);
                return res.json({
                    status: 'failed',
                    error: prediction.error || 'Video generation failed',
                    progress: 0,
                });
            }

            case 'starting':
            case 'processing':
            default: {
                // Replicate doesn't provide a percentage; estimate based on logs length
                const logs = prediction.logs || '';
                const progress = logs.length > 0 ? Math.min(50, Math.floor(logs.length / 10)) : 5;

                console.log(`[Veo 3.1 Poll] Status: ${prediction.status}, estimated progress: ${progress}%`);
                return res.json({
                    status: 'pending',
                    progress,
                });
            }
        }
    } catch (error) {
        console.error('[Veo 3.1 Poll] Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
