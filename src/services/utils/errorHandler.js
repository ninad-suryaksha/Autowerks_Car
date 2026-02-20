/**
 * User-friendly error messages mapped from API/network errors
 */
const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Please check your internet connection and try again.',
    API_TIMEOUT: 'The request is taking longer than expected. Please try again.',
    INVALID_INPUT: 'Please provide valid information and try again.',
    GENERATION_FAILED: 'Image generation failed. Please try again.',
    VIDEO_FAILED: 'Video generation failed. Please try again.',
    QUOTA_EXCEEDED: 'Service is temporarily busy. Please wait a moment and try again.',
    UNKNOWN: 'An unexpected error occurred. Please try again.',
};

/**
 * Classify an error and return a user-friendly message
 * @param {Error} error - The error
 * @returns {{ message: string, type: string }}
 */
export const classifyError = (error) => {
    if (!error.response) {
        return { message: ERROR_MESSAGES.NETWORK_ERROR, type: 'network' };
    }

    const status = error.response?.status;

    switch (status) {
        case 400:
            return { message: ERROR_MESSAGES.INVALID_INPUT, type: 'validation' };
        case 429:
            return { message: ERROR_MESSAGES.QUOTA_EXCEEDED, type: 'rate_limit' };
        case 504:
            return { message: ERROR_MESSAGES.API_TIMEOUT, type: 'timeout' };
        case 500:
            return { message: ERROR_MESSAGES.GENERATION_FAILED, type: 'server' };
        default:
            return { message: ERROR_MESSAGES.UNKNOWN, type: 'unknown' };
    }
};

export { ERROR_MESSAGES };
