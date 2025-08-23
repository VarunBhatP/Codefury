import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const PaymentTest = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const testStripeConnection = async () => {
        setLoading(true);
        setResult('Testing Stripe connection...');

        try {
            const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
            console.log('Stripe key:', stripeKey ? 'Present' : 'Missing');
            
            if (!stripeKey) {
                setResult('❌ Stripe publishable key is missing');
                return;
            }

            const stripe = await loadStripe(stripeKey);
            if (stripe) {
                setResult('✅ Stripe loaded successfully');
            } else {
                setResult('❌ Failed to load Stripe');
            }
        } catch (error) {
            setResult(`❌ Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const testPaymentIntent = async () => {
        setLoading(true);
        setResult('Testing payment intent creation...');

        try {
            const response = await fetch('https://codefury-1-top1.onrender.com/api/orders/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({
                    artIds: ['507f1f77bcf86cd799439011'], // Test art ID
                }),
            });

            const data = await response.json();
            
            if (response.ok) {
                setResult(`✅ Payment intent created: ${data.data.clientSecret.substring(0, 20)}...`);
                console.log('Payment intent data:', data);
            } else {
                setResult(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            setResult(`❌ Network error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Payment System Test</h2>
            
            <div className="space-y-4">
                <button
                    onClick={testStripeConnection}
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    Test Stripe Connection
                </button>
                
                <button
                    onClick={testPaymentIntent}
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50"
                >
                    Test Payment Intent Creation
                </button>
                
                <div className="mt-4 p-3 bg-gray-100 rounded">
                    <strong>Result:</strong> {result}
                </div>
            </div>
        </div>
    );
};

export default PaymentTest;
