import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getApiUrl } from '../config/api';

const UserOrders = () => {
    const { isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await fetch(getApiUrl('ORDERS', 'GET_USER_ORDERS'), {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.data || []);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (error) {
            setError('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Please login to view your orders</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-800 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button
                    onClick={fetchOrders}
                    className="mt-2 text-orange-800 hover:text-orange-900 underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-8">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p className="text-gray-500 text-lg">No orders yet</p>
                <p className="text-gray-400 text-sm">Start shopping to see your order history</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900">Order History</h3>
                <button
                    onClick={fetchOrders}
                    className="text-orange-800 hover:text-orange-900 text-sm underline"
                >
                    Refresh
                </button>
            </div>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID: {order._id}</p>
                                <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}>
                                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                    <img
                                        src={item.art.images && item.art.images.length > 0 ? item.art.images[0] : 'https://placehold.co/100x100/f4a261/264653?text=No+Image'}
                                        alt={item.art.title}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.art.title}</h4>
                                        <p className="text-sm text-gray-500">₹{item.priceAtPurchase}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-medium text-gray-900">Total:</span>
                                <span className="text-xl font-bold text-orange-800">₹{order.totalAmount}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserOrders;
