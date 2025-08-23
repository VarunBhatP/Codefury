import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApiUrl } from '../config/api';
import ImageWithLoader from '../components/ImageWithLoader';

const SharedArtworkPage = () => {
    const { shareToken } = useParams();
    const navigate = useNavigate();
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSharedArtwork = async () => {
            try {
                const apiUrl = getApiUrl('SHARE', 'GET_SHARED').replace(':shareToken', shareToken);
                
                const response = await fetch(apiUrl);
                
                if (response.ok) {
                    const data = await response.json();
                    setArtwork(data.data);
                } else {
                    const errorData = await response.json();
                    setError(errorData.message || 'Failed to load shared artwork');
                }
            } catch (err) {
                setError('Network error. Please check your connection.');
            } finally {
                setLoading(false);
            }
        };

        if (shareToken) {
            fetchSharedArtwork();
        } else {
            setError('Invalid share link');
            setLoading(false);
        }
    }, [shareToken]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
                    <p className="text-orange-800 font-medium">Loading shared artwork...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Share Link Not Found</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-orange-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-900 transition-colors"
                    >
                        Go to Gallery
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-orange-900 mb-2">Shared Artwork</h1>
                    <p className="text-gray-600">Someone shared this beautiful piece with you</p>
                </div>

                {/* Artwork Display */}
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-2/3">
                            <div className="relative aspect-square md:aspect-auto md:h-96">
                                <ImageWithLoader
                                    src={artwork.images[0]}
                                    alt={artwork.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/3 p-8">
                            <div className="space-y-6">
                                {/* Title and Artist */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{artwork.title}</h2>
                                    <div className="flex items-center space-x-3">
                                        {artwork.artist?.avatar && (
                                            <img
                                                src={artwork.artist.avatar}
                                                alt={artwork.artist.userName}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                        )}
                                        <div>
                                            <p className="text-orange-800 font-medium">
                                                by {artwork.artist?.userName || 'Unknown Artist'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description */}
                                {artwork.description && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                                        <p className="text-gray-600 leading-relaxed">{artwork.description}</p>
                                    </div>
                                )}

                                {/* Details */}
                                <div className="space-y-3">
                                    {artwork.category && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Category:</span>
                                            <span className="font-medium text-gray-900">{artwork.category}</span>
                                        </div>
                                    )}
                                    
                                    {artwork.medium && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Medium:</span>
                                            <span className="font-medium text-gray-900">{artwork.medium}</span>
                                        </div>
                                    )}
                                    
                                    {artwork.dimensions && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Dimensions:</span>
                                            <span className="font-medium text-gray-900">{artwork.dimensions}</span>
                                        </div>
                                    )}

                                    {artwork.price && artwork.isForSale && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Price:</span>
                                            <span className="font-bold text-orange-800 text-lg">₹{artwork.price}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3 pt-4">
                                    <button
                                        onClick={() => navigate('/gallery')}
                                        className="w-full bg-orange-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-900 transition-colors"
                                    >
                                        Explore More Artworks
                                    </button>
                                    
                                    <button
                                        onClick={() => navigate(`/artwork/${artwork._id}`)}
                                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        View Full Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Images */}
                {artwork.images && artwork.images.length > 1 && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">More Views</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {artwork.images.slice(1).map((image, index) => (
                                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                                    <ImageWithLoader
                                        src={image}
                                        alt={`${artwork.title} - View ${index + 2}`}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SharedArtworkPage;
