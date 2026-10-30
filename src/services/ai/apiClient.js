// API Client for AI Inference Service
// Handles upload, inference requests with backoff and retry logic

// For local dev, default to the Vite dev server proxying PHP endpoints
const API_BASE_URL = import.meta.env.VITE_XLERION_API_URL || 'http://localhost:5173/api';
const MAX_RETRIES = 5;

/**
 * Retry function with exponential backoff
 */
async function withBackoff(fn, retries = MAX_RETRIES) {
    let attempt = 0;
    let lastError;
    while (attempt < retries) {
        try {
            return await fn();
        } catch (err) {
            lastError = err;
            attempt++;
            if (attempt >= retries) {
                throw new Error(`Max retries (${retries}) reached: ${lastError.message}`);
            }
            const wait = Math.pow(2, attempt) * 100;
            console.warn(`Retry attempt ${attempt}/${retries}, waiting ${wait}ms...`);
            await new Promise(resolve => setTimeout(resolve, wait));
        }
    }
}

/**
 * Upload image to server
 * @param {File} file - Image file to upload
 * @param {string} token - Bearer JWT token
 * @returns {Promise<{fileId: string, url: string}>}
 */
export async function uploadImage(file, token) {
    return withBackoff(async () => {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('metadata', JSON.stringify({
            filename: file.name,
            size: file.size,
            type: file.type,
            timestamp: Date.now()
        }));

        const res = await fetch(`${API_BASE_URL}/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: fd
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Upload failed: ${res.status}`);
        }

        return res.json();
    });
}

/**
 * Request inference on uploaded image
 * @param {string} fileUrl - URL of uploaded file
 * @param {string} token - Bearer JWT token
 * @param {string} model - Model identifier
 * @param {number} threshold - Confidence threshold (0-1)
 * @returns {Promise<{requestId: string, predictions: Array, explain: Object}>}
 */
export async function inferImage(fileUrl, token, model = 'coffee-pest-v1', threshold = 0.5) {
    return withBackoff(async () => {
        const res = await fetch(`${API_BASE_URL}/infer`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fileUrl,
                model,
                threshold,
                explain: true, // Request XAI heatmap
                options: {
                    returnMasks: false, // Set to true for segmentation masks
                    returnRaw: false
                }
            })
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || `Inference failed: ${res.status}`);
        }

        const data = await res.json();

        // If job is async, poll for results
        if (data.jobId) {
            return pollJob(data.jobId, token);
        }

        return data;
    });
}

/**
 * Poll for async job results
 * @param {string} jobId - Job identifier
 * @param {string} token - Bearer JWT token
 * @returns {Promise<Object>}
 */
async function pollJob(jobId, token, maxAttempts = 30) {
    let attempts = 0;

    while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const res = await fetch(`${API_BASE_URL}/infer/job/${jobId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!res.ok) {
            throw new Error(`Job polling failed: ${res.status}`);
        }

        const data = await res.json();

        if (data.status === 'completed') {
            return data.result;
        }

        if (data.status === 'failed') {
            throw new Error(data.error || 'Job failed');
        }

        attempts++;
    }

    throw new Error('Job polling timeout');
}

/**
 * Request demo token (mock implementation)
 * In production, this would authenticate and return a real JWT
 */
export async function requestDemoToken() {
    // Mock implementation for demo
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                token: 'demo_' + Math.random().toString(36).substring(7),
                expiresIn: 3600
            });
        }, 500);
    });
}

/**
 * Health check endpoint
 */
export async function healthCheck() {
    try {
        const res = await fetch(`${API_BASE_URL}/health`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return res.ok;
    } catch {
        return false;
    }
}
