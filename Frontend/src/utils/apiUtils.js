import { getApiUrl } from '../config/api';

// Utility function to make authenticated API calls with automatic token refresh
export const authenticatedFetch = async (url, options = {}, refreshAccessToken) => {
    let token = localStorage.getItem('accessToken');
    
    // Add authorization header if not already present
    if (!options.headers) {
        options.headers = {};
    }
    
    if (token && !options.headers.Authorization) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    let response = await fetch(url, options);

    // If token is expired, try to refresh it and retry
    if (response.status === 401 && refreshAccessToken) {
        try {
            token = await refreshAccessToken();
            options.headers.Authorization = `Bearer ${token}`;
            response = await fetch(url, options);
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
};

// Utility function to make authenticated API calls for file uploads
export const authenticatedFormDataFetch = async (url, formData, options = {}, refreshAccessToken) => {
    let token = localStorage.getItem('accessToken');
    
    // Add authorization header if not already present
    if (!options.headers) {
        options.headers = {};
    }
    
    if (token && !options.headers.Authorization) {
        options.headers.Authorization = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData - let the browser set it with boundary
    if (options.headers['Content-Type']) {
        delete options.headers['Content-Type'];
    }

    let response = await fetch(url, {
        ...options,
        body: formData,
        headers: options.headers
    });

    // If token is expired, try to refresh it and retry
    if (response.status === 401 && refreshAccessToken) {
        try {
            token = await refreshAccessToken();
            options.headers.Authorization = `Bearer ${token}`;
            response = await fetch(url, {
                ...options,
                body: formData,
                headers: options.headers
            });
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
}; 