/**
 * Convert a File to base64 string
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 encoded string
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

/**
 * Resize image to max dimension while maintaining aspect ratio
 * Uses canvas for client-side processing
 * @param {File} file - Image file
 * @param {number} maxDimension - Maximum width or height
 * @returns {Promise<Blob>} Resized image as Blob
 */
export const resizeImage = (file, maxDimension = 2048) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let { width, height } = img;

            if (width <= maxDimension && height <= maxDimension) {
                resolve(file);
                return;
            }

            const ratio = Math.min(maxDimension / width, maxDimension / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
                (blob) => resolve(blob),
                'image/jpeg',
                0.85
            );
        };
        img.src = URL.createObjectURL(file);
    });
};

/**
 * Process image: resize and convert to base64
 * @param {File} file - Image file
 * @returns {Promise<{ base64: string, mimeType: string }>}
 */
export const processImageForApi = async (file) => {
    const resized = await resizeImage(file);
    const base64 = await fileToBase64(resized);
    return {
        base64,
        mimeType: file.type || 'image/jpeg',
    };
};
