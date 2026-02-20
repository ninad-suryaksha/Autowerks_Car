/**
 * POST /api/generate-video
 * Initiates a 360° video generation using Replicate's Veo 3.1 model
 *
 * Body: { images: string[] (base64), prompt: string }
 * Returns: { predictionId: string }
 *
 * Uses the Replicate API with model google/veo-3.1:
 * https://replicate.com/google/veo-3.1
 *
 * Reference images are passed as data URIs to the model's image input.
 */
import Replicate from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export default async function generateVideoHandler(req, res) {
    try {
        const { images, prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        if (!process.env.REPLICATE_API_TOKEN) {
            return res.status(500).json({
                error: 'REPLICATE_API_TOKEN not configured.',
            });
        }

        // Build the input for Replicate's Veo 3.1 model
        const input = {
            prompt: prompt,
            aspect_ratio: '16:9',
            duration: 8,
        };

        // Pass the first Nano Banana image (Front View) as the reference image.
        // Replicate's Veo 3.1 schema only takes a single 'image' parameter,
        // so we use the best hero shot (Front View, images[0]) to drive the generation.
        if (images && images.length > 0) {
            try {
                const img = images[0];
                console.log(`[Veo 3.1 Replicate] Preparing reference image...`);

                // If the image is already a data URI or a URL, use as is
                // Otherwise, construct a data URI assuming it's a raw base64 string
                if (img.startsWith('data:') || img.startsWith('http')) {
                    input.image = img;
                } else {
                    input.image = `data:image/png;base64,${img}`;
                }

                console.log('[Veo 3.1 Replicate] ✅ Reference image attached');
            } catch (imageErr) {
                console.warn('[Veo 3.1 Replicate] Image preparation failed:', imageErr.message);
            }
        }

        console.log(`[Veo 3.1 Replicate] Creating prediction...`);
        console.log(`[Veo 3.1 Replicate] Prompt length: ${prompt.length} chars`);
        console.log(`[Veo 3.1 Replicate] Has reference image: ${!!input.image}`);

        // Create an async prediction (does not wait for completion)
        const prediction = await replicate.predictions.create({
            model: 'google/veo-3.1',
            input: input,
        });

        console.log('[Veo 3.1 Replicate] ✅ Prediction created:', prediction.id);
        console.log('[Veo 3.1 Replicate] Status:', prediction.status);

        res.json({
            predictionId: prediction.id,
        });
    } catch (error) {
        console.error('[Veo 3.1 Replicate] Server error:', error);

        // Handle Replicate-specific errors
        const statusCode = error.response?.status || 500;
        const errorMessage = error.response?.data?.detail || error.message || 'Internal server error';

        res.status(statusCode).json({ error: errorMessage });
    }
}
