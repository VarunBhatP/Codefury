import React, { useState } from 'react';

const AdvancedSearch = ({ onSearch, onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        artForm: '',
        isForSale: '',
        priceRange: '',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    const artForms = ['Warli', 'Pithora', 'Madhubani', 'Other'];
    const priceRanges = [
        { label: 'Any Price', value: '' },
        { label: 'Under ₹1,000', value: '0-1000' },
        { label: '₹1,000 - ₹5,000', value: '1000-5000' },
        { label: '₹5,000 - ₹10,000', value: '5000-10000' },
        { label: 'Over ₹10,000', value: '10000+' }
    ];

    const handleFilterChange = (name, value) => {
        const newFilters = { ...filters, [name]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        onSearch(searchTerm, filters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            artForm: '',
            isForSale: '',
            priceRange: '',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        };
        setFilters(clearedFilters);
        setSearchTerm('');
        onFilterChange(clearedFilters);
        onSearch('', clearedFilters);
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-orange-900 mb-6">Search & Filter</h3>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search artworks by title, description, or tags..."
                        className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <button
                        type="submit"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-orange-800 text-white px-4 py-2 rounded-lg hover:bg-orange-900 transition-colors"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Art Form Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Art Form
                    </label>
                    <select
                        value={filters.artForm}
                        onChange={(e) => handleFilterChange('artForm', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">All Forms</option>
                        {artForms.map(form => (
                            <option key={form} value={form}>{form}</option>
                        ))}
                    </select>
                </div>

                {/* Sale Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Availability
                    </label>
                    <select
                        value={filters.isForSale}
                        onChange={(e) => handleFilterChange('isForSale', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">All Artworks</option>
                        <option value="true">For Sale</option>
                        <option value="false">Not for Sale</option>
                    </select>
                </div>

                {/* Price Range Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                    </label>
                    <select
                        value={filters.priceRange}
                        onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        {priceRanges.map(range => (
                            <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                    </select>
                </div>

                {/* Sort By Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                    </label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="createdAt">Date Created</option>
                        <option value="title">Title</option>
                        <option value="price">Price</option>
                        <option value="likes">Likes</option>
                    </select>
                </div>
            </div>

            {/* Sort Order */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="sortOrder"
                            value="desc"
                            checked={filters.sortOrder === 'desc'}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Newest First</span>
                    </label>
                    <label className="flex items-center space-x-2">
                        <input
                            type="radio"
                            name="sortOrder"
                            value="asc"
                            checked={filters.sortOrder === 'asc'}
                            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                            className="text-orange-600 focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">Oldest First</span>
                    </label>
                </div>

                <button
                    onClick={clearFilters}
                    className="text-orange-800 hover:text-orange-900 font-medium text-sm underline"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
};

export default AdvancedSearch; 