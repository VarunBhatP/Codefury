import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(10);

    useEffect(() => {
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
    }, [navigate]);

    const paymentIntentId = searchParams.get('payment_intent');
    const errorMessage = searchParams.get('error_message') || 'Payment failed';

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                    <p className="text-gray-600 mb-4">{errorMessage}</p>
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
                        Try Again
                    </button>
                    
                    <button
                        onClick={() => navigate('/cart')}
                        className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Return to Cart
                    </button>
                    
                    <p className="text-sm text-gray-500">
                        Redirecting to home in {countdown} seconds...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
