
import React, { useState, createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authenticatedFetch } from '../utils/apiUtils';

const ArtContext = createContext();

export const ArtProvider = ({ children }) => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cart, setCart] = useState([]);
    const { refreshAccessToken } = useAuth();

    // Fetch all artworks from backend
    const fetchArtworks = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await fetch('https://codefury-1-top1.onrender.com/api/art/getAllArt', {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                // The backend returns { data: { arts, pagination } }
                const artworks = data.data.arts || [];
                
                // Transform backend data to match frontend structure
                const transformedArtworks = artworks.map(art => ({
                    id: art._id,
                    title: art.title,
                    artist: art.artist?.userName || 'Unknown Artist',
                    artistId: art.artist?._id,
                    category: art.artForm,
                    price: art.price || 0,
                    description: art.description,
                    story: art.description, // Using description as story for now
                    imageURL: art.images && art.images.length > 0 ? art.images[0] : 'https://placehold.co/600x800/f4a261/264653?text=No+Image',
                    images: art.images || [],
                    likes: art.likes ? art.likes.length : 0,
                    isLiked: false, // Will be updated based on user's likes
                    isBookmarked: false, // Will be updated based on user's bookmarks
                    isForSale: art.isForSale || false,
                    tags: art.tags || [],
                    createdAt: art.createdAt,
                    updatedAt: art.updatedAt
                }));
                
                setArtworks(transformedArtworks);
            } else {
                throw new Error('Failed to fetch artworks');
            }
        } catch (error) {
            console.error('Error fetching artworks:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Add new artwork to the list
    const addArtwork = (newArtwork) => {
        // Transform the new artwork to match the frontend structure
        const transformedArtwork = {
            id: newArtwork._id,
            title: newArtwork.title,
            artist: newArtwork.artist?.userName || 'Unknown Artist',
            artistId: newArtwork.artist?._id,
            category: newArtwork.artForm,
            price: newArtwork.price || 0,
            description: newArtwork.description,
            story: newArtwork.description,
            imageURL: newArtwork.images && newArtwork.images.length > 0 ? newArtwork.images[0] : 'https://placehold.co/600x800/f4a261/264653?text=No+Image',
            images: newArtwork.images || [],
            likes: 0,
            isLiked: false,
            isBookmarked: false,
            isForSale: newArtwork.isForSale || false,
            tags: newArtwork.tags || [],
            createdAt: newArtwork.createdAt,
            updatedAt: newArtwork.updatedAt
        };
        
        setArtworks(prev => [transformedArtwork, ...prev]);
    };

    // Fetch artworks on component mount
    useEffect(() => {
        fetchArtworks();
    }, []);

    const toggleLike = async (id) => {
        try {
            const response = await authenticatedFetch(
                `https://codefury-1-top1.onrender.com/api/art/likeArt/${id}`,
                { method: 'PATCH' },
                refreshAccessToken
            );

            if (response.ok) {
                setArtworks(artworks.map(art => 
                    art.id === id ? { ...art, isLiked: !art.isLiked, likes: art.isLiked ? art.likes - 1 : art.likes + 1 } : art
                ));
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    };

    const toggleBookmark = (id) => {
        setArtworks(artworks.map(art => 
            art.id === id ? { ...art, isBookmarked: !art.isBookmarked } : art
        ));
    };
    
    const addToCart = (artwork) => {
        setCart(prevCart => {
            const isItemInCart = prevCart.find(item => item.id === artwork.id);
            if (isItemInCart) {
                return prevCart;
            }
            return [...prevCart, { ...artwork, quantity: 1 }];
        });
    };

    const removeFromCart = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    };

    const updateQuantity = (id, quantity) => {
        setCart(prevCart => 
            prevCart.map(item => 
                item.id === id ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    const refreshArtworks = () => {
        fetchArtworks();
    };

    return (
        <ArtContext.Provider value={{ 
            artworks, 
            loading,
            error,
            toggleLike, 
            toggleBookmark, 
            cart, 
            addToCart, 
            removeFromCart, 
            updateQuantity,
            clearCart,
            addArtwork,
            refreshArtworks
        }}>
            {children}
        </ArtContext.Provider>
    );
};

export const useArt = () => useContext(ArtContext);
