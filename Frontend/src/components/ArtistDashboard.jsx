import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

const ArtistDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalArtworks: 0,
            totalForSale: 0,
            totalLikes: 0,
            totalComments: 0,
            avgPrice: 0,
            totalViews: 0
        },
        recentArtworks: [],
        artFormStats: [],
        monthlyUploads: [],
        topArtworks: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchDashboardData();
        }
    }, [isAuthenticated, user]);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(getApiUrl('ARTS', 'ARTIST_STATS'), {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Dashboard data:', data);
                setDashboardData(data.data);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Failed to fetch dashboard data:', errorData);
                setError(`Failed to load dashboard: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(`Failed to load dashboard: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        fetchDashboardData();
    };

    if (!isAuthenticated) {
        return (
            <div className="bg-orange-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-orange-900 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-4">Please log in to access your artist dashboard.</p>
                    <Link
                        to="/login"
                        className="bg-orange-800 text-white font-bold py-2 px-4 rounded hover:bg-orange-900 transition-colors"
                    >
                        Login
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="bg-orange-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-orange-50 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        <p className="text-lg font-semibold mb-2">Error Loading Dashboard</p>
                        <p className="text-sm mb-4">{error}</p>
                        <button 
                            onClick={handleRefresh} 
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-orange-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold font-serif text-orange-900">Artist Dashboard</h1>
                        <p className="text-lg text-gray-700 mt-2">Welcome back, <span className="font-semibold">{user?.userName}</span>!</p>
                    </div>
                    <Link
                        to="/upload-art"
                        className="mt-4 md:mt-0 bg-orange-800 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Upload New Art</span>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
                    <StatCard icon="art" value={dashboardData.stats.totalArtworks} label="Total Artworks" />
                    <StatCard icon="likes" value={dashboardData.stats.totalLikes.toLocaleString()} label="Total Likes" />
                    <StatCard icon="views" value={dashboardData.stats.totalViews.toLocaleString()} label="Total Views" />
                    <StatCard icon="comments" value={dashboardData.stats.totalComments.toLocaleString()} label="Comments" />
                    <StatCard icon="sales" value={dashboardData.stats.totalForSale} label="For Sale" />
                    <StatCard icon="earnings" value={`₹${dashboardData.stats.avgPrice.toLocaleString()}`} label="Avg Price" />
                </div>

                {/* Main Content Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Artworks */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-bold text-orange-900 font-serif">Your Recent Work</h3>
                            <Link to="/gallery" className="text-orange-800 hover:underline font-medium text-sm">View All</Link>
                        </div>
                        {dashboardData.recentArtworks.length > 0 ? (
                            <div className="space-y-4">
                                {dashboardData.recentArtworks.map(art => (
                                    <ArtworkRow key={art._id} artwork={art} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <p className="text-gray-500">You haven't uploaded any art yet.</p>
                                <Link
                                    to="/upload-art"
                                    className="mt-4 inline-block bg-orange-800 text-white font-bold py-2 px-4 rounded hover:bg-orange-900 transition-colors"
                                >
                                    Upload Your First Artwork
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Quick Actions & Stats */}
                    <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-2xl font-bold text-orange-900 font-serif mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <ActionLink to="/profile" icon="profile" text="Edit Your Profile" />
                                {/* <ActionLink to="/orders" icon="orders" text="Manage Orders" /> */}
                                {/* <ActionLink to="/settings" icon="settings" text="Account Settings" /> */}
                                <button onClick={handleRefresh} className="w-full text-left flex items-center p-3 text-gray-700 rounded-lg hover:bg-orange-50 transition-colors">
                                    <div className="w-8 h-8 flex items-center justify-center mr-3">
                                        <RefreshIcon />
                                    </div>
                                    <span className="font-medium">Refresh Data</span>
                                </button>
                            </div>
                        </div>

                        {/* Art Form Distribution */}
                        {dashboardData.artFormStats.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-orange-900 font-serif mb-4">Art Forms</h3>
                                <div className="space-y-2">
                                    {dashboardData.artFormStats.map((form, index) => (
                                        <div key={form._id} className="flex justify-between items-center">
                                            <span className="text-gray-700">{form._id}</span>
                                            <span className="font-semibold text-orange-800">{form.count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Top Performing Artworks */}
                        {dashboardData.topArtworks.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-bold text-orange-900 font-serif mb-4">Top Performers</h3>
                                <div className="space-y-3">
                                    {dashboardData.topArtworks.map((art, index) => (
                                        <div key={art._id} className="flex items-center space-x-3">
                                            <div className="w-6 h-6 bg-orange-100 text-orange-800 rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-800 truncate">{art.title}</p>
                                                <p className="text-sm text-gray-500">{art.likeCount} likes</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components for Cleaner Layout ---

const StatCard = ({ icon, value, label }) => {
    const icons = {
        art: <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
        likes: <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
        views: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
        comments: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
        sales: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        earnings: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>,
    };
    const bgColors = {
        art: "bg-orange-100", likes: "bg-red-100", views: "bg-blue-100", comments: "bg-green-100", sales: "bg-green-100", earnings: "bg-purple-100"
    };
    return (
        <div className="bg-white rounded-lg shadow-md p-4 text-center transition-transform hover:-translate-y-1">
            <div className={`w-12 h-12 ${bgColors[icon]} rounded-full flex items-center justify-center mx-auto mb-3`}>
                {icons[icon]}
            </div>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            <p className="text-gray-500 text-sm font-medium">{label}</p>
        </div>
    );
};

const ArtworkRow = ({ artwork }) => (
    <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-orange-50">
        <img 
            src={artwork.images?.[0] || 'https://placehold.co/80x80/e9c46a/264653?text=Art'} 
            alt={artwork.title} 
            className="w-20 h-20 rounded-md object-cover" 
        />
        <div className="flex-1">
            <h4 className="font-bold text-gray-800">{artwork.title}</h4>
            <p className="text-sm text-gray-500">{artwork.artForm}</p>
        </div>
        <div className="text-right">
            <p className="font-semibold text-gray-700">{artwork.likes?.length || 0} Likes</p>
            <p className="text-sm text-gray-500">{artwork.comments?.length || 0} Comments</p>
        </div>
    </div>
);

const ActionLink = ({ to, icon, text }) => {
    const icons = {
        profile: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
        orders: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    };
    return (
        <Link to={to} className="flex items-center p-3 text-gray-700 rounded-lg hover:bg-orange-50 transition-colors">
            <div className="w-8 h-8 flex items-center justify-center mr-3">{icons[icon]}</div>
            <span className="font-medium">{text}</span>
        </Link>
    );
};

const RefreshIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 15M20 20l-1.5-1.5A9 9 0 003.5 9" />
    </svg>
);

export default ArtistDashboard;
