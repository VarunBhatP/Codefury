// src/pages/LeaderboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import { HeartIcon } from '../components/Icons';

const LeaderboardPage = () => {
    const [topArtists, setTopArtists] = useState([]);
    const [topArtworks, setTopArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('artists');
    const [error, setError] = useState('');

    const fetchTopArtists = async () => {
        try {
            console.log('Fetching top artists from:', getApiUrl('ARTS', 'LEADERBOARD_ARTISTS'));
            const response = await fetch(getApiUrl('ARTS', 'LEADERBOARD_ARTISTS'));
            console.log('Artist response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Artist data:', data);
                setTopArtists(data.data.leaderboard || []);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Failed to fetch top artists:', errorData);
                setError(`Failed to load artist leaderboard: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching top artists:', error);
            setError(`Failed to load artist leaderboard: ${error.message}`);
        }
    };

    const fetchTopArtworks = async () => {
        try {
            console.log('Fetching top artworks from:', getApiUrl('ARTS', 'LEADERBOARD_ARTWORKS'));
            const response = await fetch(getApiUrl('ARTS', 'LEADERBOARD_ARTWORKS'));
            console.log('Artwork response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Artwork data:', data);
                setTopArtworks(data.data.topArtPieces || []);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Failed to fetch top artworks:', errorData);
                setError(`Failed to load artwork leaderboard: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching top artworks:', error);
            setError(`Failed to load artwork leaderboard: ${error.message}`);
        }
    };

    useEffect(() => {
        setLoading(true);
        setError('');
        
        // Fetch both leaderboards
        Promise.all([fetchTopArtists(), fetchTopArtworks()])
            .finally(() => setLoading(false));
    }, []);

    const getRankBadge = (rank) => {
        const rankClasses = {
            1: "bg-yellow-400 text-yellow-900",
            2: "bg-slate-300 text-slate-800",
            3: "bg-orange-400 text-orange-900",
        };
        const defaultClass = "bg-gray-200 text-gray-700";
        return (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${rankClasses[rank] || defaultClass}`}>
                {rank}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-16 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Leaderboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-16 text-center">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
                    <p className="text-lg font-semibold mb-2">Error Loading Leaderboard</p>
                    <p className="text-sm">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-orange-50 min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif text-orange-900">Community Leaderboard</h1>
                    <p className="text-lg text-gray-700 mt-2 max-w-2xl mx-auto">Discover the most celebrated artists and artworks on KalaKriti.</p>
                </div>

                {/* Tab Navigation */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white rounded-full p-1 shadow-md">
                        <button
                            onClick={() => setActiveTab('artists')}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === 'artists' ? 'bg-orange-800 text-white' : 'text-gray-600 hover:bg-orange-100'}`}
                        >
                            Top Artists
                        </button>
                        <button
                            onClick={() => setActiveTab('artworks')}
                            className={`px-6 py-2 rounded-full font-semibold transition-colors duration-300 ${activeTab === 'artworks' ? 'bg-orange-800 text-white' : 'text-gray-600 hover:bg-orange-100'}`}
                        >
                            Top Artworks
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'artists' && (
                        <div className="space-y-4">
                            {topArtists.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No artists found</p>
                                    <p className="text-gray-400 text-sm">Be the first to upload artwork!</p>
                                </div>
                            ) : (
                                topArtists.map((artist) => (
                                    <div key={artist._id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transition-transform hover:scale-105 hover:shadow-xl">
                                        {getRankBadge(artist.rank)}
                                        <img 
                                            src={artist.artist?.avatar || `https://placehold.co/64x64/e9c46a/264653?text=${artist.artist?.userName?.charAt(0) || 'A'}`} 
                                            alt={artist.artist?.userName || 'Unknown Artist'} 
                                            className="w-16 h-16 rounded-full object-cover border-2 border-orange-100" 
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800">{artist.artist?.userName || 'Unknown Artist'}</h3>
                                            <p className="text-gray-600">{artist.totalArt} Artworks</p>
                                        </div>
                                        <div className="flex items-center text-red-500 font-bold">
                                            <HeartIcon className="w-5 h-5 mr-2" isFilled={true} />
                                            <span>{artist.totalLikes.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'artworks' && (
                        <div className="space-y-4">
                            {topArtworks.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">No artworks found</p>
                                    <p className="text-gray-400 text-sm">Be the first to upload artwork!</p>
                                </div>
                            ) : (
                                topArtworks.map((artwork) => (
                                    <div key={artwork._id} className="bg-white rounded-lg shadow-md p-4 flex items-center space-x-4 transition-transform hover:scale-105 hover:shadow-xl">
                                        {getRankBadge(artwork.rank)}
                                        <img 
                                            src={artwork.images?.[0] || 'https://placehold.co/80x80/e9c46a/264653?text=Art'} 
                                            alt={artwork.title} 
                                            className="w-20 h-20 rounded-md object-cover border-2 border-orange-100" 
                                        />
                                        <div className="flex-1">
                                            <Link to={`/artwork/${artwork._id}`} className="text-xl font-bold text-gray-800 hover:text-orange-700">
                                                {artwork.title}
                                            </Link>
                                            <p className="text-gray-600">by {artwork.artist?.userName || 'Unknown Artist'}</p>
                                        </div>
                                        <div className="flex items-center text-red-500 font-bold">
                                            <HeartIcon className="w-5 h-5 mr-2" isFilled={true} />
                                            <span>{artwork.likeCount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LeaderboardPage;
