import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useArt } from '../context/ArtContext';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../utils/apiUtils';

const ArtistDashboard = () => {
    const { user, refreshAccessToken } = useAuth();
    const { artworks, refreshArtworks } = useArt();
    const [stats, setStats] = useState({
        totalArtworks: 0,
        totalLikes: 0,
        totalViews: 0,
        totalSales: 0,
        totalEarnings: 0
    });
    const [recentArtworks, setRecentArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            fetchArtistStats();
            fetchRecentArtworks();
        }
    }, [user, artworks]); // Re-run when artworks change

    const fetchArtistStats = async () => {
        try {
            // First try to get stats from context
            const userArtworks = artworks.filter(art => art.artistId === user._id);
            
            if (userArtworks.length > 0) {
                const totalLikes = userArtworks.reduce((sum, art) => sum + (art.likes || 0), 0);
                const totalViews = userArtworks.reduce((sum, art) => sum + (art.views || 0), 0);
                const totalSales = userArtworks.filter(art => art.isSold).length;
                const totalEarnings = userArtworks
                    .filter(art => art.isSold)
                    .reduce((sum, art) => sum + (art.price || 0), 0);

                setStats({
                    totalArtworks: userArtworks.length,
                    totalLikes,
                    totalViews,
                    totalSales,
                    totalEarnings
                });
            } else {
                // Fallback to API call
                const response = await authenticatedFetch(
                    `http://localhost:8080/api/art/user/${user._id}`,
                    { method: 'GET' },
                    refreshAccessToken
                );

                if (response.ok) {
                    const data = await response.json();
                    const artworks = data.data;
                    
                    const totalLikes = artworks.reduce((sum, art) => sum + (art.likes?.length || 0), 0);
                    const totalViews = artworks.reduce((sum, art) => sum + (art.views || 0), 0);
                    const totalSales = artworks.filter(art => art.isSold).length;
                    const totalEarnings = artworks
                        .filter(art => art.isSold)
                        .reduce((sum, art) => sum + (art.price || 0), 0);

                    setStats({
                        totalArtworks: artworks.length,
                        totalLikes,
                        totalViews,
                        totalSales,
                        totalEarnings
                    });
                }
            }
        } catch (error) {
            console.error('Failed to fetch artist stats:', error);
        }
    };

    const fetchRecentArtworks = async () => {
        try {
            // First try to get from context
            const userArtworks = artworks.filter(art => art.artistId === user._id);
            
            if (userArtworks.length > 0) {
                // Sort by creation date and take the 5 most recent
                const sortedArtworks = userArtworks
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
                setRecentArtworks(sortedArtworks);
            } else {
                // Fallback to API call
                const response = await authenticatedFetch(
                    `http://localhost:8080/api/art/user/${user._id}?limit=5`,
                    { method: 'GET' },
                    refreshAccessToken
                );

                if (response.ok) {
                    const data = await response.json();
                    setRecentArtworks(data.data);
                }
            }
        } catch (error) {
            console.error('Failed to fetch recent artworks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        refreshArtworks();
        fetchArtistStats();
        fetchRecentArtworks();
    };

    if (!user) return null;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-orange-900 mb-2">Artist Dashboard</h1>
                <p className="text-gray-600">Welcome back, {user.userName}! Here's your creative journey overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalArtworks}</h3>
                    <p className="text-gray-600 text-sm">Total Artworks</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalLikes}</h3>
                    <p className="text-gray-600 text-sm">Total Likes</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalViews}</h3>
                    <p className="text-gray-600 text-sm">Total Views</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{stats.totalSales}</h3>
                    <p className="text-gray-600 text-sm">Total Sales</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">₹{stats.totalEarnings.toLocaleString()}</h3>
                    <p className="text-gray-600 text-sm">Total Earnings</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-orange-900">Quick Actions</h3>
                    <button
                        onClick={handleRefresh}
                        className="text-orange-800 hover:text-orange-900 font-medium text-sm underline"
                    >
                        Refresh Data
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                        to="/upload-art"
                        className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Upload New Art</h4>
                            <p className="text-sm text-gray-600">Share your latest creation</p>
                        </div>
                    </Link>

                    <Link
                        to="/profile"
                        className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">Edit Profile</h4>
                            <p className="text-sm text-gray-600">Update your information</p>
                        </div>
                    </Link>

                    <Link
                        to="/orders"
                        className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                    >
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-4">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900">View Orders</h4>
                            <p className="text-sm text-gray-600">Check your sales</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Recent Artworks */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-orange-900">Recent Artworks</h3>
                    <Link
                        to="/gallery"
                        className="text-orange-800 hover:text-orange-900 font-medium text-sm underline"
                    >
                        View All
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Loading...</p>
                    </div>
                ) : recentArtworks.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No artworks yet</p>
                        <p className="text-gray-400 text-sm">Start creating to see your work here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentArtworks.map((artwork) => (
                            <div key={artwork.id} className="bg-gray-50 rounded-lg overflow-hidden">
                                <img
                                    src={artwork.imageURL}
                                    alt={artwork.title}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h4 className="font-medium text-gray-900 mb-2">{artwork.title}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{artwork.description.substring(0, 100)}...</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">{artwork.category}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm text-gray-500">{artwork.likes || 0} likes</span>
                                            {artwork.isForSale && (
                                                <span className="text-orange-800 font-medium">₹{artwork.price}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ArtistDashboard; 