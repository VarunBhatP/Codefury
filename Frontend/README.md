# KalaKriti Frontend

A React-based frontend for the KalaKriti Indian folk art marketplace platform.

## Features

- **Authentication System**: User registration, login, and profile management
- **Art Gallery**: Browse and search artworks with advanced filtering
- **Artist Dashboard**: Manage artworks, view statistics, and track performance
- **Shopping Cart**: Add artworks to cart and checkout with Stripe integration
- **Comments System**: Leave and manage comments on artworks
- **Leaderboard**: View top artists and trending artworks
- **Responsive Design**: Modern UI built with Tailwind CSS

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```env
# Stripe Configuration
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_public_key_here

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1
```

3. Start the development server:
```bash
npm run dev
```

## Component Structure

### Authentication
- `AuthContext.jsx` - User authentication state management
- `LoginModal.jsx` - User login form
- `RegisterModal.jsx` - User registration form
- `UserProfile.jsx` - User profile display and editing

### Art Management
- `ArtUploadForm.jsx` - Upload new artworks with multiple images
- `AdvancedSearch.jsx` - Advanced search and filtering
- `CommentsSection.jsx` - Artwork comments system

### E-commerce
- `ShoppingCart.jsx` - Shopping cart with Stripe checkout
- `ArtistDashboard.jsx` - Artist statistics and artwork management

### Navigation & Layout
- `Navbar.jsx` - Main navigation with user menu
- `Footer.jsx` - Site footer
- `Leaderboard.jsx` - Top artists and artworks ranking

## Backend Integration

This frontend is designed to work with the KalaKriti backend API, which includes:

- User authentication and management
- Artwork CRUD operations
- Order processing with Stripe
- File uploads to Cloudinary
- Advanced search and filtering

## Styling

The application uses Tailwind CSS for styling with a consistent orange color scheme that reflects the Indian folk art theme.

## Contributing

1. Follow the existing code style and component structure
2. Ensure all new components are responsive
3. Test authentication flows and API integrations
4. Maintain the orange color scheme for consistency
