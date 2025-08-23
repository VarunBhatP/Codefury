// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useArt } from '../context/ArtContext';
import ArtCard from '../components/ArtCard';

const HomePage = () => {
    const { artworks } = useArt();
    return (
        <div className="bg-orange-50">
            {/* Hero Section */}
            <div 
                className="relative bg-cover bg-center" 
                style={{ backgroundImage: 'linear-gradient(rgba(42, 22, 6, 0.6), rgba(42, 22, 6, 0.6)), url(https://placehold.co/1600x800/e9c46a/2a9d8f?text=Folk+Art+Collage)' }}
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
                        <a 
                            href="#" 
                            className="w-full sm:w-auto bg-white text-orange-800 font-bold py-3 px-8 rounded-full hover:bg-orange-100 transition-transform hover:scale-105 text-lg shadow-lg"
                        >
                            Get Started
                        </a>
                    </div>
                     <p className="text-sm mt-4">Are you an artist? <a href="#" className="underline hover:text-orange-200">Join our community</a>.</p>
                </div>
            </div>

            {/* Our Mission Section */}
            <div className="bg-white">
                <div className="container mx-auto px-6 py-16 text-center">
                    <h2 className="text-3xl font-bold text-orange-900 mb-4">Our Mission</h2>
                    <p className="max-w-3xl mx-auto text-gray-700 leading-relaxed">
                        KalaKriti is dedicated to preserving the rich legacy of Indian folk art. We empower local artists by providing a global platform to showcase their talent, share their stories, and sustain their livelihoods in the digital age.
                    </p>
                </div>
            </div>


            {/* Featured Artworks Section */}
            <div className="container mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold text-center text-orange-900 mb-8">Featured Works</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {artworks.slice(0, 3).map(art => <ArtCard key={art.id} artwork={art} />)}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
