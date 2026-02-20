/**
 * POST /api/generate-images
 * Generates a color-modified car image using Gemini Nano Banana API
 *
 * Body: { image: { base64, mimeType }, prompt: string }
 * Returns: { generatedImage: string (base64) }
 */
export default async function generateImagesHandler(req, res) {
    try {
        const { image, prompt } = req.body;

        if (!image || !prompt) {
            return res.status(400).json({ error: 'Missing image or prompt' });
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({
                error: 'GEMINI_API_KEY not configured. Add it to your environment variables.',
            });
        }

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key=${apiKey}`;

        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: image.mimeType,
                                data: image.base64,
                            },
                        },
                    ],
                },
            ],
            generationConfig: {
                responseModalities: ['TEXT', 'IMAGE'],
                temperature: 0.4,
            },
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Gemini API error:', response.status, errorData);
            return res.status(response.status).json({
                error: `API error: ${response.status}`,
            });
        }

        const data = await response.json();

        // Extract generated image from response
        const parts = data.candidates?.[0]?.content?.parts || [];
        const imagePart = parts.find((p) => p.inlineData);

        if (!imagePart) {
            return res.status(500).json({
                error: 'No image generated in response',
            });
        }

        res.json({
            generatedImage: imagePart.inlineData.data,
        });
    } catch (error) {
        console.error('Generate images error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
