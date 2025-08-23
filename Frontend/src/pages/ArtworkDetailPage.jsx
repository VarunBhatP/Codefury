import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArt } from '../context/ArtContext';
import { useAuth } from '../context/AuthContext';
import ImageWithLoader from '../components/ImageWithLoader';
import { HeartIcon, BookmarkIcon, ShareIcon } from '../components/Icons';
import { authenticatedFetch } from '../utils/apiUtils';

const ArtworkDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { artworks, toggleLike, toggleBookmark, addToCart, refreshArtworks } = useArt();
    const { user, isAuthenticated, refreshAccessToken } = useAuth();
    
    const [artwork, setArtwork] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Find artwork from context first, then fetch from backend if not found
    useEffect(() => {
        const findArtwork = async () => {
            // First try to find in context
            let foundArtwork = artworks.find(art => art.id === id);
            
            if (foundArtwork) {
                setArtwork(foundArtwork);
                setLoading(false);
            } else {
                // If not found in context, fetch from backend
                try {
                    const response = await fetch(`http://localhost:8080/api/art/getArtById/${id}`);
                    
                    if (response.ok) {
                        const data = await response.json();
                        const backendArtwork = data.data;
                        
                        // Transform backend data to match frontend structure
                        const transformedArtwork = {
                            id: backendArtwork._id,
                            title: backendArtwork.title,
                            artist: backendArtwork.artist?.userName || 'Unknown Artist',
                            artistId: backendArtwork.artist?._id,
                            category: backendArtwork.artForm,
                            price: backendArtwork.price || 0,
                            description: backendArtwork.description,
                            story: backendArtwork.description,
                            imageURL: backendArtwork.images && backendArtwork.images.length > 0 ? backendArtwork.images[0] : 'https://placehold.co/600x800/f4a261/264653?text=No+Image',
                            images: backendArtwork.images || [],
                            likes: backendArtwork.likes ? backendArtwork.likes.length : 0,
                            isLiked: false,
                            isBookmarked: false,
                            isForSale: backendArtwork.isForSale || false,
                            tags: backendArtwork.tags || [],
                            createdAt: backendArtwork.createdAt,
                            updatedAt: backendArtwork.updatedAt
                        };
                        
                        setArtwork(transformedArtwork);
                    } else {
                        throw new Error('Artwork not found');
                    }
                } catch (error) {
                    console.error('Error fetching artwork:', error);
                    setError('Artwork not found');
                } finally {
                    setLoading(false);
                }
            }
        };

        if (id) {
            findArtwork();
        }
    }, [id, artworks]);

    const handleLike = async () => {
        if (!isAuthenticated) {
            // Redirect to login or show login modal
            return;
        }
        
        try {
            await toggleLike(artwork.id);
            // Update local state
            setArtwork(prev => ({
                ...prev,
                isLiked: !prev.isLiked,
                likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
            }));
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const handleBookmark = () => {
        if (!isAuthenticated) {
            // Redirect to login or show login modal
            return;
        }
        
        toggleBookmark(artwork.id);
        // Update local state
        setArtwork(prev => ({
            ...prev,
            isBookmarked: !prev.isBookmarked
        }));
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            // Redirect to login or show login modal
            return;
        }
        
        addToCart(artwork);
        // You could show a toast notification here
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12">
                <div className="flex justify-center items-center min-h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading artwork...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !artwork) {
        return (
            <div className="container mx-auto px-6 py-12">
                <div className="text-center py-20">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Artwork not found</h3>
                    <p className="text-gray-500 mb-6">The artwork you're looking for doesn't exist or has been removed.</p>
                    <button
                        onClick={() => navigate('/gallery')}
                        className="bg-orange-800 text-white px-6 py-3 rounded-lg hover:bg-orange-900 transition-colors font-medium"
                    >
                        Back to Gallery
                    </button>
                </div>
            </div>
        );
    }

    // Check if current user is the artist
    const isOwner = isAuthenticated && user && artwork.artistId === user._id;

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* Image Column */}
                <div className="rounded-lg overflow-hidden shadow-lg">
                    <ImageWithLoader src={artwork.imageURL} alt={artwork.title} />
                    
                    {/* Show all images if there are multiple */}
                    {artwork.images && artwork.images.length > 1 && (
                        <div className="mt-4 grid grid-cols-4 gap-2">
                            {artwork.images.map((image, index) => (
                                <div key={index} className="rounded-lg overflow-hidden">
                                    <ImageWithLoader 
                                        src={image} 
                                        alt={`${artwork.title} - Image ${index + 1}`}
                                        className="h-20 w-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Column */}
                <div>
                    <p className="font-semibold text-orange-600 mb-1">{artwork.category}</p>
                    <h1 className="text-4xl font-bold font-serif text-gray-900">{artwork.title}</h1>
                    <p className="text-xl text-gray-600 mt-2">by <span className="font-semibold text-gray-800">{artwork.artist}</span></p>
                    
                    {artwork.isForSale ? (
                        <p className="text-4xl font-extrabold text-gray-900 my-6">₹{artwork.price.toLocaleString()}</p>
                    ) : (
                        <p className="text-lg text-gray-500 my-6">Not for sale</p>
                    )}
                    
                    <div className="flex items-center space-x-4 mb-8">
                        {artwork.isForSale && (
                            <button 
                                onClick={handleAddToCart} 
                                className="flex-grow bg-orange-800 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-900 transition-colors"
                            >
                                Add to Cart
                            </button>
                        )}
                        <button onClick={handleLike} className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                            <HeartIcon isFilled={artwork.isLiked} className={`w-6 h-6 ${artwork.isLiked ? 'text-red-500' : 'text-gray-600'}`} />
                        </button>
                        <button onClick={handleBookmark} className="p-3 rounded-lg bg-gray-100 hover:bg-gray-200">
                            <BookmarkIcon isFilled={artwork.isBookmarked} className={`w-5 h-5 ${artwork.isBookmarked ? 'text-orange-500' : 'text-gray-600'}`} />
                        </button>
                    </div>

                    {/* Art Details Tabs */}
                    <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold text-gray-800">Description</h3>
                        <p className="text-gray-600 mt-2">{artwork.description}</p>
                        
                        {artwork.story && artwork.story !== artwork.description && (
                            <>
                                <h3 className="text-lg font-semibold text-gray-800 mt-6">The Story</h3>
                                <p className="text-gray-600 mt-2 italic">"{artwork.story}"</p>
                            </>
                        )}

                        {artwork.tags && artwork.tags.length > 0 && (
                            <>
                                <h3 className="text-lg font-semibold text-gray-800 mt-6">Tags</h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {artwork.tags.map((tag, index) => (
                                        <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                    
                    {/* Engagement Section */}
                    <div className="mt-8 p-4 bg-orange-50 rounded-lg">
                         <h3 className="text-lg font-semibold text-gray-800">Engage & Share</h3>
                         <div className="flex space-x-4 mt-3">
                            <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg text-sm">Attend Workshop (Zoom)</button>
                            <button className="flex items-center space-x-2 bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg text-sm">
                                <ShareIcon className="w-4 h-4" />
                                <span>Share</span>
                            </button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetailPage;