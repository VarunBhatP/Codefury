import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useArt } from '../context/ArtContext';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { clearCart } = useArt();
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        // Clear the cart on successful payment
        clearCart();

        // Countdown timer to redirect to home
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [clearCart, navigate]);

    const paymentIntentId = searchParams.get('payment_intent');
    const paymentStatus = searchParams.get('redirect_status');

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                {paymentStatus === 'succeeded' ? (
                    <>
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
                            <p className="text-gray-600">Thank you for your purchase. Your order has been confirmed.</p>
                        </div>

                        {paymentIntentId && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-500">Payment ID: {paymentIntentId}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-orange-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-900 transition-colors"
                            >
                                Continue Shopping
                            </button>
                            
                            <p className="text-sm text-gray-500">
                                Redirecting to home in {countdown} seconds...
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Status Unknown</h1>
                            <p className="text-gray-600">We're processing your payment. Please check your email for confirmation.</p>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-orange-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-900 transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PaymentSuccess;
