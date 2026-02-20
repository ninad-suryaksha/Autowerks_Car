import axios from 'axios';
import { API_CONFIG } from '../../config/api.config';
import { retryableApiCall } from '../utils/retryLogic';

/**
 * Initiate video generation using Veo 3.1 via Replicate backend proxy
 * @param {string[]} imageBase64Array - Generated image base64 strings
 * @param {string} prompt - Constructed video prompt
 * @returns {Promise<string>} Prediction ID for polling
 */
export const initiateVideoGeneration = async (imageBase64Array, prompt) => {
    const result = await retryableApiCall(async () => {
        const response = await axios.post(API_CONFIG.endpoints.generateVideo, {
            images: imageBase64Array,
            prompt,
        });
        return response.data;
    });

    return result.predictionId;
};

/**
 * Poll for video generation completion
 * @param {string} predictionId - Prediction ID from Replicate
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<string>} Video URL
 */
export const pollVideoStatus = async (predictionId, onProgress) => {
    const maxAttempts = 120; // 20 minutes max (10s intervals)
    let attempt = 0;

    while (attempt < maxAttempts) {
        const response = await axios.get(API_CONFIG.endpoints.pollVideo, {
            params: { predictionId },
        });

        const { status, videoUrl, progress } = response.data;

        onProgress?.(progress || Math.min(attempt * 3, 95));

        if (status === 'completed' && videoUrl) {
            onProgress?.(100);
            return videoUrl;
        }

        if (status === 'failed') {
            throw new Error(response.data.error || 'Video generation failed');
        }

        attempt++;
        await new Promise((resolve) =>
            setTimeout(resolve, API_CONFIG.veo.pollInterval)
        );
    }

    throw new Error('Video generation timed out');
};
