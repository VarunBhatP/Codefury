import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArt } from '../context/ArtContext';

const Leaderboard = () => {
    const { artworks, refreshArtworks } = useArt();
    const [topArtists, setTopArtists] = useState([]);
    const [topArtworks, setTopArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('artists');

    useEffect(() => {
        fetchLeaderboardData();
    }, [artworks]); // Re-run when artworks change

    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch top artists
            const artistsResponse = await fetch('http://localhost:8080/api/art/leaderboard/artists');
            if (artistsResponse.ok) {
                const artistsData = await artistsResponse.json();
                // Backend returns { data: { leaderboard, pagination, timeFrame } }
                setTopArtists(artistsData.data.leaderboard || []);
            }

            // Fetch top artworks
            const artworksResponse = await fetch('http://localhost:8080/api/art/leaderboard/artpieces');
            if (artworksResponse.ok) {
                const artworksData = await artworksResponse.json();
                // Backend returns { data: { topArtPieces, timeFrame, artForm } }
                setTopArtworks(artworksData.data.topArtPieces || []);
            }
        } catch (error) {
            console.error('Failed to fetch leaderboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        refreshArtworks();
        fetchLeaderboardData();
    };

    const getRankBadge = (rank) => {
        if (rank === 1) {
            return (
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                </div>
            );
        } else if (rank === 2) {
            return (
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                </div>
            );
        } else if (rank === 3) {
            return (
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                </div>
            );
        } else {
            return (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 font-bold text-sm">
                    {rank}
                </div>
            );
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading leaderboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-orange-900 mb-4">Leaderboard</h1>
                <p className="text-gray-600 text-lg">Discover the most talented artists and trending artworks</p>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center mb-6">
                <button
                    onClick={handleRefresh}
                    className="bg-orange-800 text-white px-6 py-2 rounded-lg hover:bg-orange-900 transition-colors font-medium"
                >
                    Refresh Leaderboard
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('artists')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            activeTab === 'artists'
                                ? 'bg-white text-orange-800 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Top Artists
                    </button>
                    <button
                        onClick={() => setActiveTab('artworks')}
                        className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                            activeTab === 'artworks'
                                ? 'bg-white text-orange-800 shadow-sm'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        Top Artworks
                    </button>
                </div>
            </div>

            {/* Artists Leaderboard */}
            {activeTab === 'artists' && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-orange-900">Top Artists</h2>
                        <p className="text-gray-600">Ranked by total likes and engagement</p>
                    </div>
                    
                    {topArtists.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No artist data available yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {topArtists.map((artistData, index) => (
                                <div key={artistData.artist._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        {getRankBadge(index + 1)}
                                        
                                        <img
                                            src={artistData.artist.avatar || 'https://placehold.co/64x64/f4a261/264653?text=Artist'}
                                            alt={artistData.artist.userName}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {artistData.artist.userName}
                                            </h3>
                                            <p className="text-gray-600 mb-2">
                                                Mixed Media • {artistData.totalArt || 0} artworks
                                            </p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {artistData.totalLikes || 0} total likes
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {artistData.totalComments || 0} comments
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <Link
                                            to={`/artist/${artistData.artist._id}`}
                                            className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                                        >
                                            View Profile
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Artworks Leaderboard */}
            {activeTab === 'artworks' && (
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-orange-900">Top Artworks</h2>
                        <p className="text-gray-600">Most liked and trending pieces</p>
                    </div>
                    
                    {topArtworks.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No artwork data available yet</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {topArtworks.map((artwork, index) => (
                                <div key={artwork._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        {getRankBadge(index + 1)}
                                        
                                        <img
                                            src={artwork.images && artwork.images.length > 0 ? artwork.images[0] : 'https://placehold.co/80x80/f4a261/264653?text=Art'}
                                            alt={artwork.title}
                                            className="w-20 h-20 rounded-lg object-cover border-2 border-gray-200"
                                        />
                                        
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                {artwork.title}
                                            </h3>
                                            <p className="text-gray-600 mb-2">
                                                by {artwork.artist?.userName || 'Unknown Artist'} • {artwork.artForm || 'Mixed Media'}
                                            </p>
                                            <p className="text-gray-700 mb-2 line-clamp-2">
                                                {artwork.description}
                                            </p>
                                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {artwork.likes?.length || 0} likes
                                                </span>
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {artwork.comments?.length || 0} comments
                                                </span>
                                                {artwork.isForSale && (
                                                    <span className="text-orange-800 font-medium">
                                                        ₹{artwork.price}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <Link
                                            to={`/artwork/${artwork._id}`}
                                            className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                                        >
                                            View Artwork
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Stats Overview */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{topArtists.length}</h3>
                    <p className="text-gray-600">Featured Artists</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{topArtworks.length}</h3>
                    <p className="text-gray-600">Featured Artworks</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Trending</h3>
                    <p className="text-gray-600">This Week</p>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard; 