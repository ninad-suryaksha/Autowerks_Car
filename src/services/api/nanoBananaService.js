import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { retryableApiCall } from '../utils/retryLogic';

/**
 * Generate images using Nano Banana (Gemini 2.5 Flash Image) via backend proxy
 * @param {Array<{ base64: string, mimeType: string }>} images - Processed images
 * @param {string[]} prompts - Constructed prompts for the 4 views
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<string[]>} Array of generated image base64 strings
 */
export const generateImages = async (images, prompts, onProgress) => {
    let completed = 0;

    const promises = prompts.map(async (prompt, index) => {
        const result = await retryableApiCall(async () => {
            const response = await axios.post(
                API_CONFIG.endpoints.generateImages,
                {
                    images: images,
                    prompt: prompt,
                },
                { timeout: API_CONFIG.nanoBanana.timeout * 2 } // May take slightly longer since we send all images
            );
            return response.data;
        });

        completed++;
        onProgress?.(Math.round((completed / prompts.length) * 100));

        return result.generatedImage;
    });

    const results = await Promise.all(promises);
    return results.filter(img => img);
};
