import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ArtUploadForm from '../components/ArtUploadForm';

const ArtUploadPage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [showUploadForm, setShowUploadForm] = useState(true);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        navigate('/');
        return null;
    }

    const handleUploadSuccess = (artwork) => {
        // Redirect to the newly created artwork
        navigate(`/artwork/${artwork._id}`);
    };

    const handleClose = () => {
        navigate('/gallery');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-900 mb-4">Upload Your Artwork</h1>
                    <p className="text-xl text-gray-600">
                        Share your creative masterpiece with the KalaKriti community
                    </p>
                </div>

                {/* Upload Form */}
                {showUploadForm && (
                    <ArtUploadForm
                        onClose={handleClose}
                        onSuccess={handleUploadSuccess}
                    />
                )}

                {/* Tips Section */}
                <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-orange-900 mb-6">Upload Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Image Requirements</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Upload up to 5 high-quality images
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    First image will be the main display image
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Supported formats: JPG, PNG, GIF
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Maximum file size: 100MB per image
                                </li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Art Form Guidelines</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <strong>Warli:</strong> Tribal art from Maharashtra
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <strong>Pithora:</strong> Ritualistic art from Gujarat
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <strong>Madhubani:</strong> Ancient art from Bihar
                                </li>
                                <li className="flex items-center">
                                    <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    <strong>Other:</strong> Regional folk art forms
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-orange-50 rounded-lg">
                        <h3 className="text-lg font-semibold text-orange-900 mb-2">💡 Pro Tips</h3>
                        <ul className="text-orange-800 space-y-1">
                            <li>• Use descriptive titles and detailed descriptions to help art lovers discover your work</li>
                            <li>• Add relevant tags to improve searchability</li>
                            <li>• Set competitive prices if you're selling your artwork</li>
                            <li>• Upload multiple angles to showcase your artwork's details</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtUploadPage; 