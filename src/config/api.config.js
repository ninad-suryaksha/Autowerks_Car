const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_CONFIG = {
    baseUrl: API_BASE,
    nanoBanana: {
        model: 'gemini-3-pro-image-preview',
        timeout: 90000,
    },
    veo: {
        model: 'google/veo-3.1',
        pollInterval: 10000,
        timeout: 300000,
    },
    endpoints: {
        generateImages: `${API_BASE}/generate-images`,
        generateVideo: `${API_BASE}/generate-video`,
        pollVideo: `${API_BASE}/poll-video`,
    },
};
