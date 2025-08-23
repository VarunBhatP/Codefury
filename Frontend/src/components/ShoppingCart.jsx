import React, { useState } from 'react';
import { useArt } from '../context/ArtContext';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';
// import { loadStripe } from '@stripe/stripe-js';

const ShoppingCart = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity } = useArt();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const handleQuantityChange = (id, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(id, newQuantity);
    };

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            setError('Please login to checkout');
            return;
        }

        if (cart.length === 0) {
            setError('Your cart is empty');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // For now, we'll handle one item at a time
            // In a real app, you might want to handle multiple items
            const item = cart[0];
            
            const response = await fetch(getApiUrl('ORDERS', 'CREATE_PAYMENT_INTENT'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    artId: item.id,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // Load Stripe
                const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
                
                if (stripe) {
                    const { error } = await stripe.confirmPayment({
                        clientSecret: data.data.clientSecret,
                        confirmParams: {
                            return_url: `${window.location.origin}/payment-success`,
                        },
                    });

                    if (error) {
                        setError(error.message);
                    }
                }
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Checkout failed');
            }
        } catch (error) {
            setError('Checkout failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-orange-900">Shopping Cart</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <p className="text-gray-500 text-lg">Your cart is empty</p>
                            <p className="text-gray-400 text-sm">Add some beautiful artwork to get started</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.images[0]}
                                        alt={item.title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.artist}</p>
                                        <p className="text-lg font-bold text-orange-800">₹{item.price}</p>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors flex items-center justify-center"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors flex items-center justify-center"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-6">
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-lg font-medium text-gray-900">Total:</span>
                            <span className="text-2xl font-bold text-orange-800">₹{calculateTotal()}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading || !isAuthenticated}
                            className="w-full bg-orange-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Processing...' : isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </button>

                        {!isAuthenticated && (
                            <p className="text-center text-sm text-gray-500 mt-2">
                                Please login to complete your purchase
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart; 