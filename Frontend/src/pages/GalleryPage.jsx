import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArt } from '../context/ArtContext';
import { useAuth } from '../context/AuthContext';
import ArtCard from '../components/ArtCard';
import CategoryFilter from '../components/CategoryFilter';

const GalleryPage = () => {
    const { artworks, loading, error, refreshArtworks } = useArt();
    const { isAuthenticated } = useAuth();
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Update filtered artworks when artworks change
    useEffect(() => {
        if (artworks.length > 0) {
            setFilteredArtworks(artworks);
        }
    }, [artworks]);

    const categories = ['All', ...new Set(artworks.map(art => art.category))];

    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            setFilteredArtworks(artworks);
        } else {
            setFilteredArtworks(artworks.filter(art => art.category === category));
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-center items-center min-h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading artworks...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-center items-center min-h-96">
                    <div className="text-center">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            Error loading artworks: {error}
                        </div>
                        <button 
                            onClick={refreshArtworks}
                            className="bg-orange-800 text-white px-6 py-3 rounded-lg hover:bg-orange-900 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-4xl font-bold text-orange-900 font-serif">Art Gallery</h1>
                    <p className="text-gray-600 max-w-2xl mt-2">
                        Browse our curated collection of authentic Warli, Madhubani, and Pithora paintings, sourced directly from the artists.
                    </p>
                </div>
                {isAuthenticated && (
                    <Link
                        to="/upload-art"
                        className="bg-orange-800 text-white px-6 py-3 rounded-lg hover:bg-orange-900 transition-colors font-medium flex items-center space-x-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Upload Art</span>
                    </Link>
                )}
            </div>
            
            {artworks.length > 0 ? (
                <>
                    <CategoryFilter 
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onSelectCategory={handleSelectCategory}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {filteredArtworks.map(art => <ArtCard key={art.id} artwork={art} />)}
                    </div>
                </>
            ) : (
                <div className="text-center py-16">
                    <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No artworks yet</h3>
                    <p className="text-gray-500 mb-6">Be the first to share your artwork with the community!</p>
                    {isAuthenticated && (
                        <Link
                            to="/upload-art"
                            className="bg-orange-800 text-white px-6 py-3 rounded-lg hover:bg-orange-900 transition-colors font-medium"
                        >
                            Upload Your First Artwork
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default GalleryPage;