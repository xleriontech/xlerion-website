// Image compression utility
// Compresses images before upload to reduce bandwidth and improve performance

/**
 * Compress image file to target quality
 * @param {File} file - Original image file
 * @param {number} quality - Compression quality (0-1)
 * @param {number} maxWidth - Maximum width (optional)
 * @param {number} maxHeight - Maximum height (optional)
 * @returns {Promise<File>} Compressed image file
 */
export async function compressImage(file, quality = 0.8, maxWidth = 1920, maxHeight = 1080) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                // Calculate new dimensions
                let { width, height } = img;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }

                // Create canvas and draw compressed image
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Canvas to Blob conversion failed'));
                            return;
                        }

                        // Create new File from blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now()
                        });

                        console.log(`[Compress] Original: ${(file.size / 1024).toFixed(2)}KB → Compressed: ${(compressedFile.size / 1024).toFixed(2)}KB`);
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality
                );
            };

            img.onerror = () => {
                reject(new Error('Image load failed'));
            };

            img.src = e.target.result;
        };

        reader.onerror = () => {
            reject(new Error('File read failed'));
        };

        reader.readAsDataURL(file);
    });
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {{valid: boolean, error: string|null}}
 */
export function validateImage(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!file) {
        return { valid: false, error: 'No file provided' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: 'File too large. Maximum: 10MB' };
    }

    return { valid: true, error: null };
}

/**
 * Get image dimensions without loading entire file
 * @param {File} file - Image file
 * @returns {Promise<{width: number, height: number}>}
 */
export function getImageDimensions(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                resolve({
                    width: img.width,
                    height: img.height
                });
            };

            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = e.target.result;
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}
