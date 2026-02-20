import { MAX_FILE_SIZE, ALLOWED_FORMATS, MAX_IMAGES } from '../../config/constants';

/**
 * Validate a single file for type and size
 * @param {File} file - File to validate
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export const validateFile = (file) => {
    const errors = [];

    if (!ALLOWED_FORMATS.includes(file.type)) {
        errors.push('Invalid file type. Allowed: JPG, PNG, WEBP');
    }

    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
        errors.push(`File too large. Maximum size: ${sizeMB}MB`);
    }

    return { isValid: errors.length === 0, errors };
};

/**
 * Validate total file count against max limit
 * @param {number} currentCount - Current number of files
 * @param {number} newCount - Number of new files being added
 * @returns {{ isValid: boolean, error?: string }}
 */
export const validateFileCount = (currentCount, newCount) => {
    const total = currentCount + newCount;
    if (total > MAX_IMAGES) {
        return {
            isValid: false,
            error: `Maximum ${MAX_IMAGES} images allowed. You can upload ${MAX_IMAGES - currentCount} more.`,
        };
    }
    return { isValid: true };
};
