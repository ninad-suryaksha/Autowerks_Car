import { MAX_RETRIES } from '../../config/constants';

/**
 * Determine if an error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean}
 */
const isRetryableError = (error) => {
    if (!error.response) return true; // Network error
    const status = error.response?.status;
    return status === 429 || status === 503 || status === 504;
};

/**
 * Execute an API call with exponential backoff retry logic
 * @param {Function} apiFunction - Async function to retry
 * @param {number} maxRetries - Maximum number of retry attempts
 * @returns {Promise<any>} Response from the API
 */
export const retryableApiCall = async (apiFunction, maxRetries = MAX_RETRIES) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await apiFunction();
        } catch (error) {
            if (attempt === maxRetries || !isRetryableError(error)) {
                throw error;
            }

            // Exponential backoff: 1s, 2s, 4s, capped at 10s
            const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
};
