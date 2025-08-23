// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useArt } from '../context/ArtContext';
// import { getApiUrl } from '../config/api';

// const EditArtworkPage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const { user, isAuthenticated } = useAuth();
//     const { artworks, updateArtwork } = useArt();
    
//     const [artwork, setArtwork] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState('');
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         price: '',
//         category: '',
//         tags: ''
//     });

//     useEffect(() => {
//         if (!isAuthenticated) {
//             navigate('/');
//             return;
//         }

//         // Find artwork in context first
//         const foundArtwork = artworks.find(art => art.id === parseInt(id));
//         if (foundArtwork) {
//             // Check if user owns this artwork
//             if (foundArtwork.artistId !== user?.id) {
//                 setError('You can only edit your own artworks');
//                 setLoading(false);
//                 return;
//             }
            
//             setArtwork(foundArtwork);
//             setFormData({
//                 title: foundArtwork.title || '',
//                 description: foundArtwork.description || '',
//                 price: foundArtwork.price || '',
//                 category: foundArtwork.category || '',
//                 tags: foundArtwork.tags ? foundArtwork.tags.join(', ') : ''
//             });
//             setLoading(false);
//         } else {
//             // Fetch from API if not in context
//             fetchArtwork();
//         }
//     }, [id, isAuthenticated, user, artworks, navigate]);

//     const fetchArtwork = async () => {
//         try {
//             const response = await fetch(getApiUrl('ARTWORKS', 'GET_BY_ID', { id }), {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//                 }
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 const artworkData = data.data;
                
//                 // Check ownership
//                 if (artworkData.artistId !== user?.id) {
//                     setError('You can only edit your own artworks');
//                     setLoading(false);
//                     return;
//                 }

//                 setArtwork(artworkData);
//                 setFormData({
//                     title: artworkData.title || '',
//                     description: artworkData.description || '',
//                     price: artworkData.price || '',
//                     category: artworkData.category || '',
//                     tags: artworkData.tags ? artworkData.tags.join(', ') : ''
//                 });
//             } else {
//                 setError('Artwork not found');
//             }
//         } catch (error) {
//             setError('Failed to load artwork');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSaving(true);
//         setError('');

//         try {
//             const updateData = {
//                 ...formData,
//                 tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
//                 price: parseFloat(formData.price) || 0
//             };

//             const response = await fetch(getApiUrl('ARTWORKS', 'UPDATE', { id }), {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
//                 },
//                 body: JSON.stringify(updateData)
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 // Update artwork in context
//                 updateArtwork(data.data);
//                 navigate(`/artwork/${id}`);
//             } else {
//                 const errorData = await response.json();
//                 setError(errorData.message || 'Failed to update artwork');
//             }
//         } catch (error) {
//             setError('Failed to update artwork');
//         } finally {
//             setSaving(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
//                     <p className="text-gray-600">Loading artwork...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error && !artwork) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
//                 <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
//                         </svg>
//                     </div>
//                     <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
//                     <p className="text-gray-600 mb-6">{error}</p>
//                     <button
//                         onClick={() => navigate('/')}
//                         className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors"
//                     >
//                         Go Home
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
//             <div className="max-w-4xl mx-auto">
//                 <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//                     {/* Header */}
//                     <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-6">
//                         <div className="flex items-center justify-between">
//                             <div>
//                                 <h1 className="text-3xl font-bold text-white mb-2">Edit Artwork</h1>
//                                 <p className="text-orange-100">Update your artwork details</p>
//                             </div>
//                             <button
//                                 onClick={() => navigate(`/artwork/${id}`)}
//                                 className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>

//                     <div className="p-6">
//                         {artwork && (
//                             <div className="grid md:grid-cols-2 gap-8">
//                                 {/* Artwork Preview */}
//                                 <div className="space-y-4">
//                                     <h3 className="text-xl font-semibold text-gray-900">Current Artwork</h3>
//                                     <div className="bg-gray-100 rounded-lg p-4">
//                                         <img
//                                             src={artwork.imageUrl}
//                                             alt={artwork.title}
//                                             className="w-full h-64 object-cover rounded-lg mb-4"
//                                         />
//                                         <div className="space-y-2">
//                                             <h4 className="font-semibold text-gray-900">{artwork.title}</h4>
//                                             <p className="text-gray-600 text-sm">{artwork.description}</p>
//                                             <div className="flex justify-between items-center">
//                                                 <span className="text-orange-600 font-bold">₹{artwork.price}</span>
//                                                 <span className="text-sm text-gray-500">{artwork.category}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Edit Form */}
//                                 <div className="space-y-6">
//                                     <h3 className="text-xl font-semibold text-gray-900">Edit Details</h3>
                                    
//                                     {error && (
//                                         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//                                             <p className="text-red-600 text-sm">{error}</p>
//                                         </div>
//                                     )}

//                                     <form onSubmit={handleSubmit} className="space-y-4">
//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Title *
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="title"
//                                                 value={formData.title}
//                                                 onChange={handleInputChange}
//                                                 required
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Description
//                                             </label>
//                                             <textarea
//                                                 name="description"
//                                                 value={formData.description}
//                                                 onChange={handleInputChange}
//                                                 rows={4}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Price (₹) *
//                                             </label>
//                                             <input
//                                                 type="number"
//                                                 name="price"
//                                                 value={formData.price}
//                                                 onChange={handleInputChange}
//                                                 min="0"
//                                                 step="0.01"
//                                                 required
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                             />
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Category
//                                             </label>
//                                             <select
//                                                 name="category"
//                                                 value={formData.category}
//                                                 onChange={handleInputChange}
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                             >
//                                                 <option value="">Select Category</option>
//                                                 <option value="painting">Painting</option>
//                                                 <option value="sculpture">Sculpture</option>
//                                                 <option value="photography">Photography</option>
//                                                 <option value="digital">Digital Art</option>
//                                                 <option value="mixed-media">Mixed Media</option>
//                                                 <option value="other">Other</option>
//                                             </select>
//                                         </div>

//                                         <div>
//                                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                                                 Tags (comma-separated)
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 name="tags"
//                                                 value={formData.tags}
//                                                 onChange={handleInputChange}
//                                                 placeholder="e.g. abstract, colorful, modern"
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
//                                             />
//                                         </div>

//                                         <div className="flex gap-4 pt-4">
//                                             <button
//                                                 type="submit"
//                                                 disabled={saving}
//                                                 className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
//                                             >
//                                                 {saving ? 'Saving...' : 'Save Changes'}
//                                             </button>
//                                             <button
//                                                 type="button"
//                                                 onClick={() => navigate(`/artwork/${id}`)}
//                                                 className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//                                             >
//                                                 Cancel
//                                             </button>
//                                         </div>
//                                     </form>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default EditArtworkPage;
