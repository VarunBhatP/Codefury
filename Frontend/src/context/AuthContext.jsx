import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiUrl } from '../config/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        checkAuthStatus();
    }, []);

    const refreshAccessToken = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await fetch(getApiUrl('USERS', 'REFRESH_TOKEN'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken }),
            });
            
            if (response.ok) {
                const data = await response.json();
                // The backend returns { data: { accessToken, refreshToken } }
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                return data.data.accessToken;
            } else {
                throw new Error('Failed to refresh token');
            }
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
            throw error;
        }
    };

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (token) {
                // Verify token with backend
                const response = await fetch(getApiUrl('USERS', 'REFRESH_TOKEN'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ refreshToken: localStorage.getItem('refreshToken') }),
                });
                
                if (response.ok) {
                    const data = await response.json();
                    // The backend returns { data: { user, accessToken, refreshToken } }
                    if (data.data.user) {
                        setUser(data.data.user);
                        setIsAuthenticated(true);
                    }
                    // Update tokens in localStorage
                    if (data.data.accessToken) {
                        localStorage.setItem('accessToken', data.data.accessToken);
                    }
                    if (data.data.refreshToken) {
                        localStorage.setItem('refreshToken', data.data.refreshToken);
                    }
                } else {
                    // Token invalid, clear storage
                    logout();
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await fetch(getApiUrl('USERS', 'LOGIN'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data.user);
                setIsAuthenticated(true);
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } catch (error) {
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    const register = async (userData, avatarFile, coverImageFile) => {
        try {
            const formData = new FormData();
            formData.append('userName', userData.userName);
            formData.append('email', userData.email);
            formData.append('password', userData.password);
            
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            if (coverImageFile) {
                formData.append('coverImage', coverImageFile);
            }

            const response = await fetch(getApiUrl('USERS', 'REGISTER'), {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data);
                setIsAuthenticated(true);
                localStorage.setItem('accessToken', data.data.accessToken);
                localStorage.setItem('refreshToken', data.data.refreshToken);
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } catch (error) {
            return { success: false, error: 'Registration failed. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            if (isAuthenticated) {
                await fetch(getApiUrl('USERS', 'LOGOUT'), {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    const updateProfile = async (updates) => {
        try {
            const response = await fetch(getApiUrl('USERS', 'UPDATE_PROFILE'), {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updates),
            });

            if (response.ok) {
                const data = await response.json();
                setUser(prev => ({ ...prev, ...data.data }));
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } catch (error) {
            return { success: false, error: 'Profile update failed.' };
        }
    };

    const updateAvatar = async (avatarFile) => {
        try {
            const formData = new FormData();
            formData.append('avatar', avatarFile);

            const response = await fetch(getApiUrl('USERS', 'UPDATE_AVATAR'), {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUser(prev => ({ ...prev, avatar: data.data.avatar }));
                return { success: true };
            } else {
                const errorData = await response.json();
                return { success: false, error: errorData.message };
            }
        } catch (error) {
            return { success: false, error: 'Avatar update failed.' };
        }
    };

    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updateAvatar,
        refreshAccessToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 