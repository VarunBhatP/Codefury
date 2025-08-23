import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useArt } from '../context/ArtContext';
import { useAuth } from '../context/AuthContext';
import { HeartIcon, BookmarkIcon } from './Icons';
import ImageWithLoader from './ImageWithLoader';
import ShareModal from './ShareModal';

const ArtCard = ({ artwork }) => {
    const { toggleLike, toggleBookmark } = useArt();
    const { user, isAuthenticated } = useAuth();
    const [showShareModal, setShowShareModal] = useState(false);
    
    // Check if current user is the artist
    const isOwner = isAuthenticated && user && artwork.artistId === user._id;
    
    const handleDeleteArtwork = async (artworkId) => {
        if (window.confirm('Are you sure you want to delete this artwork?')) {
            try {
                const response = await fetch(`https://codefury-1-top1.onrender.com/api/art/deleteArt/${artworkId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    },
                });
                
                if (response.ok) {
                    // Refresh the page or update the artwork list
                    window.location.reload();
                } else {
                    alert('Failed to delete artwork');
                }
            } catch (error) {
                console.error('Error deleting artwork:', error);
                alert('Error deleting artwork');
            }
        }
    };

    return (
        <div className="group relative overflow-hidden rounded-lg shadow-md bg-white transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            <Link to={`/artwork/${artwork.id}`} className="cursor-pointer">
                <div className="h-80 w-full">
                    <ImageWithLoader src={artwork.imageURL} alt={artwork.title} />
                </div>
                <div className="p-4">
                    <p className="text-sm font-semibold text-orange-600">{artwork.category}</p>
                    <h3 className="text-lg font-bold text-gray-800 truncate">{artwork.title}</h3>
                    <p className="text-gray-600">by {artwork.artist}</p>
                    {artwork.isForSale && (
                        <p className="text-lg font-extrabold text-gray-900 mt-2">₹{artwork.price?.toLocaleString() || '0'}</p>
                    )}
                    {!artwork.isForSale && (
                        <p className="text-sm text-gray-500 mt-2">Not for sale</p>
                    )}
                </div>
            </Link>
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Artist Actions */}
                {isOwner && (
                    <div className="flex flex-col gap-2 mb-2">
                        {/* <Link
                            to={`/edit-artwork/${artwork.id}`}
                            className="p-2 rounded-full bg-blue-500/80 backdrop-blur-sm shadow-md hover:bg-blue-500 text-white"
                            title="Edit Artwork"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                        </Link> */}
                        <button
                            onClick={() => handleDeleteArtwork(artwork.id)}
                            className="p-2 rounded-full bg-red-500/80 backdrop-blur-sm shadow-md hover:bg-red-500 text-white"
                            title="Delete Artwork"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                )}
                
                {/* User Actions */}
                <button onClick={() => toggleLike(artwork.id)} className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white`}>
                    <HeartIcon isFilled={artwork.isLiked} className={`w-5 h-5 ${artwork.isLiked ? 'text-red-500' : 'text-gray-600'}`} />
                </button>
                <button onClick={() => toggleBookmark(artwork.id)} className={`p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white`}>
                    <BookmarkIcon isFilled={artwork.isBookmarked} className={`w-5 h-5 ${artwork.isBookmarked ? 'text-orange-500' : 'text-gray-600'}`} />
                </button>
                <button 
                    onClick={() => setShowShareModal(true)} 
                    className="p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white"
                    title="Share Artwork"
                >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                </button>
            </div>
            
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                artId={artwork.id}
                artTitle={artwork.title}
            />
        </div>
    );
};

export default ArtCard;