import React from 'react';
import { API_CONFIG, getApiUrl } from '../config/api';

const EnvTest = () => {
    return (
        <div className="p-4 bg-gray-100 rounded-lg">
            <h3 className="font-bold mb-2">Environment Variables Test</h3>
            <div className="space-y-2 text-sm">
                <div>
                    <strong>VITE_API_BASE_URL:</strong> {import.meta.env.VITE_API_BASE_URL || 'NOT SET'}
                </div>
                <div>
                    <strong>API_CONFIG.BASE_URL:</strong> {API_CONFIG.BASE_URL}
                </div>
                <div>
                    <strong>Sample API URL:</strong> {getApiUrl('USERS', 'REGISTER')}
                </div>
                <div>
                    <strong>VITE_STRIPE_PUBLISHABLE_KEY:</strong> {import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'SET' : 'NOT SET'}
                </div>
            </div>
        </div>
    );
};

export default EnvTest; 