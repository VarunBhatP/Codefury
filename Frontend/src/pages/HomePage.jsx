// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useArt } from '../context/ArtContext';
import ArtCard from '../components/ArtCard';
import EnvTest from '../components/EnvTest';

const HomePage = () => {
    const { artworks, loading, error } = useArt();

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
                <div className="text-center">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            </div>
        );
    }

    const featuredArtworks = artworks.slice(0, 6);

    return (
        <div className="container mx-auto px-6 py-8">
            {/* Environment Test - Remove this after debugging */}
            <div 
                className="relative bg-cover bg-center" 
                style={{ backgroundImage: 'linear-gradient(rgba(42, 22, 6, 0.6), rgba(42, 22, 6, 0.6)), url(https://www.artudaipur.com/cdn/shop/products/RajasthaniPainting_62c40fd7-5648-4c4f-ad9e-a9e3596d5ef5.jpg?v=1629048455)' }}
            >
                <div className="container mx-auto px-6 py-24 md:py-32 text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold font-serif leading-tight drop-shadow-lg">
                        Where Heritage Meets Heart
                    </h1>
                    <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto drop-shadow-md">
                        Discover timeless stories from India's master folk artists. A curated platform to buy authentic art and support ancient traditions.
                    </p>
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link 
                            to="/gallery" 
                            className="w-full sm:w-auto bg-orange-600 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-700 transition-transform hover:scale-105 text-lg shadow-lg"
                        >
                            Explore The Gallery
                        </Link>
                      
                    </div>
                     
                </div>
            </div>

            {/* Hero Section */}
            {/* <div className="text-center mb-12">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                    Discover Beautiful
                    <span className="text-orange-600"> Indian Folk Art</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Explore authentic Warli, Madhubani, and other traditional Indian art forms from talented artists across the country.
                </p>
                <Link
                    to="/gallery"
                    className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                    Explore Gallery
                </Link>
            </div> */}

            {/* Featured Artworks */}
            <div className="mb-12">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Featured Artworks</h2>
                    <Link
                        to="/gallery"
                        className="text-orange-600 hover:text-orange-700 font-medium"
                    >
                        View All →
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {featuredArtworks.map((artwork) => (
                        <ArtCard key={artwork.id} artwork={artwork} />
                    ))}
                </div>
            </div>

            {/* Call to Action */}
            <section className="w-full bg-gradient-to-r from-orange-50 to-orange-100">
    <div className="container mx-auto text-center px-6 py-12 md:py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-4 font-serif">
            Ready to Start Your Collection?
        </h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of art lovers who have discovered unique pieces for their homes.
        </p>
        <Link
            to="/gallery"
            className="inline-block bg-orange-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
            Start Shopping
        </Link>
    </div>
</section>
        </div>
    );
};

export default HomePage;
