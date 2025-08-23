import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useArt } from '../context/ArtContext';
import { authenticatedFormDataFetch } from '../utils/apiUtils';

const ArtUploadForm = ({ onClose, onSuccess }) => {
    const { user, refreshAccessToken } = useAuth();
    const { addArtwork } = useArt();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        artForm: '',
        price: '',
        isForSale: false,
        tags: ''
    });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [previewImages, setPreviewImages] = useState([]);

    const artForms = ['Warli', 'Pithora', 'Madhubani', 'Other'];

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 5) {
            setError('Maximum 5 images allowed');
            return;
        }

        setImages(files);
        
        // Create preview URLs
        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(previews);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.title || !formData.description || !formData.artForm) {
            setError('Title, description, and art form are required');
            setLoading(false);
            return;
        }

        if (images.length === 0) {
            setError('At least one image is required');
            setLoading(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('title', formData.title);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('artForm', formData.artForm);
            formDataToSend.append('price', formData.price || '0');
            formDataToSend.append('isForSale', formData.isForSale);
            formDataToSend.append('tags', formData.tags);

            images.forEach(image => {
                formDataToSend.append('images', image);
            });

            const response = await authenticatedFormDataFetch(
                'http://localhost:8080/api/art/createArt',
                formDataToSend,
                { method: 'POST' },
                refreshAccessToken
            );

            if (response.ok) {
                const data = await response.json();
                
                // Add the new artwork to the ArtContext
                if (data.data) {
                    // Transform the backend response to match frontend structure
                    const newArtwork = {
                        ...data.data,
                        artist: { userName: user.userName, _id: user._id }, // Add artist info
                        images: data.data.images || []
                    };
                    addArtwork(newArtwork);
                }
                
                setSuccess('Artwork uploaded successfully!');
                setTimeout(() => {
                    onSuccess && onSuccess(data.data);
                    onClose();
                }, 1500);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to upload artwork');
            }
        } catch (error) {
            setError(error.message || 'Failed to upload artwork. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const [success, setSuccess] = useState('');

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-orange-900 mb-2">Upload Your Artwork</h2>
                        <p className="text-gray-600">Share your creative masterpiece with the world</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                                {success}
                            </div>
                        )}

                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Artwork Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter artwork title"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Describe your artwork..."
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="artForm" className="block text-sm font-medium text-gray-700 mb-2">
                                Art Form <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="artForm"
                                name="artForm"
                                value={formData.artForm}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required
                            >
                                <option value="">Select art form</option>
                                {artForms.map(form => (
                                    <option key={form} value={form}>{form}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                                    Price (₹)
                                </label>
                                <input
                                    type="number"
                                    id="price"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    placeholder="0.00"
                                />
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="isForSale"
                                    name="isForSale"
                                    checked={formData.isForSale}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                                />
                                <label htmlFor="isForSale" className="ml-2 text-sm text-gray-700">
                                    Available for sale
                                </label>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                                Tags
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Enter tags separated by commas"
                            />
                            <p className="text-xs text-gray-500 mt-1">Example: traditional, folk art, handmade</p>
                        </div>

                        <div>
                            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-2">
                                Images <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="file"
                                id="images"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">Upload up to 5 images (first image will be the main image)</p>
                        </div>

                        {/* Image Previews */}
                        {previewImages.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Image Previews
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {previewImages.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                            {index === 0 && (
                                                <span className="absolute top-2 left-2 bg-orange-600 text-white text-xs px-2 py-1 rounded-full">
                                                    Main
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-orange-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Uploading...' : 'Upload Artwork'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ArtUploadForm; 