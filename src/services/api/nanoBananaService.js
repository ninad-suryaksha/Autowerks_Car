import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { retryableApiCall } from '../utils/retryLogic';

/**
 * Generate images using Nano Banana (Gemini 2.5 Flash Image) via backend proxy
 * @param {Array<{ base64: string, mimeType: string }>} images - Processed images
 * @param {string} prompt - Constructed prompt
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string[]>} Array of generated image base64 strings
 */
export const generateImages = async (images, prompt, onProgress) => {
    const generatedImages = [];

    for (let i = 0; i < images.length; i++) {
        onProgress?.(Math.round(((i) / images.length) * 100));

        const result = await retryableApiCall(async () => {
            const response = await axios.post(
                API_CONFIG.endpoints.generateImages,
                {
                    image: images[i],
                    prompt,
                },
                { timeout: API_CONFIG.nanoBanana.timeout }
            );
            return response.data;
        });

        if (result.generatedImage) {
            generatedImages.push(result.generatedImage);
        }

        onProgress?.(Math.round(((i + 1) / images.length) * 100));
    }

    return generatedImages;
};
