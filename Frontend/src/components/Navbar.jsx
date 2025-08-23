import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useArt } from '../context/ArtContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon } from './Icons';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';
import ShoppingCart from './ShoppingCart';

const Navbar = () => {
    const { cart } = useArt();
    const { user, isAuthenticated, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-md' : 'bg-transparent'}`}>
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-orange-900 tracking-wider font-serif">
                    KalaKriti
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/gallery" className="text-gray-700 hover:text-orange-800 font-medium">Gallery</Link>
                    <Link to="/leaderboard" className="text-gray-700 hover:text-orange-800 font-medium">Leaderboard</Link>
                    <Link to="/about" className="text-gray-700 hover:text-orange-800 font-medium">About</Link>
                    <Link to="/artAnalyzer" className="text-gray-700 hover:text-orange-800 font-medium">AI Art Analyzer</Link>
                    {isAuthenticated && (
                        <Link to="/upload-art" className="text-gray-700 hover:text-orange-800 font-medium">Upload Art</Link>
                    )}
                    
                    {/* Shopping Cart */}
                    <div className="relative">
                        <button
                            onClick={() => setShowCart(true)}
                            className="relative"
                        >
                            <ShoppingCartIcon className="w-7 h-7 text-gray-700 hover:text-orange-800 cursor-pointer"/>
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* User Menu */}
                    {isAuthenticated ? (
                        <div className="relative group">
                            <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-800 font-medium">
                                <img
                                    src={user.avatar}
                                    alt={user.userName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span>{user.userName}</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            
                            {/* Dropdown Menu */}
                            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <div className="py-2">
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-800 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-800 transition-colors"
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-800 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowLoginModal(true)}
                                className="text-gray-700 hover:text-orange-800 font-medium"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setShowRegisterModal(true)}
                                className="bg-orange-800 text-white font-bold py-2 px-4 rounded-full hover:bg-orange-900 transition-colors"
                            >
                                Sign Up
                            </button>
                        </div>
                    )}
                </div>
            </nav>
        </header>

        {/* Modals */}
        <LoginModal
            isOpen={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onSwitchToRegister={() => {
                setShowLoginModal(false);
                setShowRegisterModal(true);
            }}
        />

        <RegisterModal
            isOpen={showRegisterModal}
            onClose={() => setShowRegisterModal(false)}
            onSwitchToLogin={() => {
                setShowRegisterModal(false);
                setShowLoginModal(true);
            }}
        />

        {/* Shopping Cart */}
        <ShoppingCart
            isOpen={showCart}
            onClose={() => setShowCart(false)}
        />
        </>
    );
};

export default Navbar;