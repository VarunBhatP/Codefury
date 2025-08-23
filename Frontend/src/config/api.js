// API Configuration using Vite environment variables
export const API_CONFIG = {
    // Base URL for all API calls
    BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
    
    // Stripe configuration
    STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    
    // API endpoints
    ENDPOINTS: {
        // User endpoints
        USERS: {
            REGISTER: '/users/register',
            LOGIN: '/users/login',
            LOGOUT: '/users/logout',
            REFRESH_TOKEN: '/users/refreshAccessToken',
            UPDATE_PROFILE: '/users/updateFullName',
            UPDATE_AVATAR: '/users/updateAvatar',
        },
        
        // Art endpoints
        ARTS: {
            CREATE: '/art/createArt',
            GET_ALL: '/art/getAllArt',
            GET_BY_ID: '/art/getArtById',
            GET_BY_USER: '/art/user',
            ADD_COMMENT: '/art/addComment',
            DELETE_COMMENT: '/art/deleteCommentFromArt',
            LEADERBOARD_ARTISTS: '/art/leaderboard/artists',
            LEADERBOARD_ARTWORKS: '/art/leaderboard/artpieces',
        },
        
        // Order endpoints
        ORDERS: {
            CREATE_PAYMENT_INTENT: '/orders/create-payment-intent',
        }
    }
};

// Helper function to build full API URLs
export const buildApiUrl = (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to get full endpoint URLs
export const getApiUrl = (category, action) => {
    const endpoint = API_CONFIG.ENDPOINTS[category]?.[action];
    if (!endpoint) {
        throw new Error(`Unknown API endpoint: ${category}.${action}`);
    }
    return buildApiUrl(endpoint);
}; 