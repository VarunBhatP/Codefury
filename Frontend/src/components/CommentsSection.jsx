import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const CommentsSection = ({ artworkId, comments = [], onCommentAdded, onCommentRemoved }) => {
    const { user, isAuthenticated } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [localComments, setLocalComments] = useState(comments);

    useEffect(() => {
        setLocalComments(comments);
    }, [comments]);

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/art/addComment/${artworkId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                const data = await response.json();
                const comment = {
                    _id: data.data._id,
                    content: newComment,
                    user: {
                        _id: user._id,
                        userName: user.userName,
                        avatar: user.avatar
                    },
                    createdAt: new Date().toISOString()
                };

                setLocalComments(prev => [comment, ...prev]);
                setNewComment('');
                onCommentAdded && onCommentAdded(comment);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to add comment');
            }
        } catch (error) {
            setError('Failed to add comment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveComment = async (commentId) => {
        try {
            const response = await fetch(`/api/art/deleteCommentFromArt/${artworkId}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                setLocalComments(prev => prev.filter(comment => comment._id !== commentId));
                onCommentRemoved && onCommentRemoved(commentId);
            } else {
                setError('Failed to remove comment');
            }
        } catch (error) {
            setError('Failed to remove comment. Please try again.');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

        if (diffInHours < 1) {
            return 'Just now';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-orange-900 mb-6">
                Comments ({localComments.length})
            </h3>

            {/* Add Comment Form */}
            {isAuthenticated ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                    <div className="flex items-start space-x-4">
                        <img
                            src={user.avatar}
                            alt={user.userName}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your thoughts about this artwork..."
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                disabled={loading}
                            />
                            {error && (
                                <p className="text-red-600 text-sm mt-2">{error}</p>
                            )}
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-sm text-gray-500">
                                    {newComment.length}/500 characters
                                </span>
                                <button
                                    type="submit"
                                    disabled={loading || !newComment.trim()}
                                    className="bg-orange-800 text-white px-6 py-2 rounded-lg hover:bg-orange-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600 mb-3">Please login to leave a comment</p>
                    <button className="text-orange-800 hover:text-orange-900 font-medium underline">
                        Login to Comment
                    </button>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
                {localComments.length === 0 ? (
                    <div className="text-center py-8">
                        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-gray-500 text-lg">No comments yet</p>
                        <p className="text-gray-400 text-sm">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    localComments.map((comment) => (
                        <div key={comment._id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                            <img
                                src={comment.user.avatar}
                                alt={comment.user.userName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="font-medium text-gray-900">
                                            {comment.user.userName}
                                        </span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    {isAuthenticated && user._id === comment.user._id && (
                                        <button
                                            onClick={() => handleRemoveComment(comment._id)}
                                            className="text-red-500 hover:text-red-700 transition-colors"
                                            title="Delete comment"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                                <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CommentsSection; 