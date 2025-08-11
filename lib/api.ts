// lib/api.ts

const API_BASE_URL = 'http://localhost:3001';

// A helper function for fetching data
async function fetcher(url: string, options?: RequestInit) {
    const res = await fetch(`${API_BASE_URL}${url}`, options);
    if (!res.ok) {
        const error = new Error('An error occurred while fetching the data.');
        try {
            // Try to parse the error message from the backend
            const errorData = await res.json();
            error.message = errorData.message || 'An error occurred.';
        } catch (e) {
            // Fallback if the error response isn't JSON
            error.message = `HTTP error! status: ${res.status}`;
        }
        throw error;
    }
    if (res.status === 204) {
        return null;
    }
    return res.json();
}

// --- API Functions ---

export const getDashboardData = (userId: string) => {
    return fetcher(`/dashboard/${userId}`);
};

export const getCollection = (collectionId: string) => {
    return fetcher(`/collections/${collectionId}`);
};

// This is the corrected function
export const createCollection = (data: { 
    name: string; 
    products: any[]; 
    userId: string; 
    description?: string; 
    coverImageUrl?: string | null; 
}) => {
    return fetcher('/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
};

export const deleteCollection = (collectionId: string) => {
    return fetcher(`/collections/${collectionId}`, {
        method: 'DELETE',
    });
};

export const searchProducts = (query: string, brandId: string | null) => {
    const params = new URLSearchParams({ q: query });
    if (brandId) {
        params.append('brandId', brandId);
    }
    return fetcher(`/products/search?${params.toString()}`);
};

export const getBrands = async () => {
    return fetcher('/brands');
};