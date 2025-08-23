# Codefury - Art Marketplace Backend API

A comprehensive Node.js/Express.js backend for an art marketplace platform that supports traditional Indian art forms like Warli, Pithora, and Madhubani. The API provides user management, art management, order processing with Stripe integration, and social features like sharing and commenting.

## 🚀 Features

- **User Management**: Registration, authentication, profile management
- **Art Management**: Create, read, update, delete art pieces with image uploads
- **Payment Processing**: Stripe integration for secure payments
- **Social Features**: Like/unlike, comments, sharing capabilities
- **Search & Discovery**: Advanced filtering, search, and trending algorithms
- **File Management**: Cloudinary integration for image storage
- **Security**: JWT authentication, password hashing, middleware protection

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer + Cloudinary
- **Payment**: Stripe
- **Security**: bcrypt for password hashing
- **CORS**: Cross-origin resource sharing support

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- Cloudinary account
- Stripe account
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Codefury
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env_sample.txt .env
   ```
   
   Fill in your environment variables in the `.env` file:
   ```env
   PORT=8080
   CORS_ORIGIN=*
   DB_NAME=your_database_name
   MONGO_URI=your_mongodb_connection_string
   
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=7d
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:8080`

## 🗄️ Database Models

### User Model
```javascript
{
  userName: String (required, unique),
  email: String (required, unique),
  avatar: String (Cloudinary URL, required),
  password: String (required, hashed),
  refreshToken: String,
  timestamps: true
}
```

### Art Model
```javascript
{
  title: String (required),
  description: String (required),
  artForm: String (enum: ["Warli", "Pithora", "Madhubani", "Other"]),
  images: [String] (Cloudinary URLs, required),
  price: Number (default: 0),
  isForSale: Boolean (default: false),
  artist: ObjectId (ref: User, required),
  likes: [ObjectId] (ref: User),
  comments: [{
    user: ObjectId (ref: User),
    text: String (required),
    createdAt: Date
  }],
  tags: [String],
  timestamps: true
}
```

### Order Model
```javascript
{
  user: ObjectId (ref: User, required),
  items: [{
    art: ObjectId (ref: Art, required),
    priceAtPurchase: Number (required)
  }],
  totalAmount: Number (required),
  paymentStatus: String (enum: ["pending", "completed", "failed"]),
  stripePaymentIntentId: String (required),
  timestamps: true
}
```

### Share Model
```javascript
{
  shareToken: String (required, unique),
  art: ObjectId (ref: Art, required),
  timestamps: true
}
```

## 🔌 API Endpoints

### Base URL: `http://localhost:8080/api`

### 🔐 Authentication Endpoints

#### User Registration
```http
POST /users/register
Content-Type: multipart/form-data

Body:
- userName: string (required)
- email: string (required)
- password: string (required)
- avatar: file (required)
- coverImage: file (optional)
```

#### User Login
```http
POST /users/login
Content-Type: application/json

Body:
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Refresh Access Token
```http
POST /users/refreshAccessToken
Content-Type: application/json

Body:
{
  "refreshToken": "your_refresh_token"
}
```

#### Logout
```http
POST /users/logout
Authorization: Bearer <access_token>
```

#### Update Password
```http
POST /users/updatePassword
Authorization: Bearer <access_token>

Body:
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

#### Update User Avatar
```http
PUT /users/updateAvatar
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body:
- avatar: file (required)
```

### 🎨 Art Management Endpoints

#### Create Art Piece
```http
POST /art/createArt
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body:
- title: string (required)
- description: string (required)
- artForm: string (required) - "Warli", "Pithora", "Madhubani", "Other"
- price: number (optional, default: 0)
- isForSale: boolean (optional, default: false)
- tags: string (comma-separated, optional)
- images: files (required, max 5)
```

#### Get All Art Pieces
```http
GET /art/getAllArt?page=1&limit=10&artForm=Warli&isForSale=true&search=keyword&sortBy=createdAt&sortOrder=desc
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `artForm`: Filter by art form
- `isForSale`: Filter by sale status
- `search`: Search in title, description, and tags
- `sortBy`: Sort field (default: createdAt)
- `sortOrder`: Sort order - "asc" or "desc" (default: "desc")

#### Get Art by ID
```http
GET /art/getArtById/:artId
```

#### Update Art Piece
```http
PATCH /art/:artId
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Body: (all fields optional)
- title: string
- description: string
- artForm: string
- price: number
- isForSale: boolean
- tags: string
- images: files (max 5)
```

#### Delete Art Piece
```http
DELETE /art/deleteArt/:artId
Authorization: Bearer <access_token>
```

#### Like/Unlike Art
```http
PATCH /art/likeArt/:artId
Authorization: Bearer <access_token>
```

#### Add Comment
```http
POST /art/addComment/:artId
Authorization: Bearer <access_token>

Body:
{
  "text": "Your comment text"
}
```

#### Remove Comment
```http
DELETE /art/deleteCommentFromArt/:artId/comments/:commentId
Authorization: Bearer <access_token>
```

#### Get Art by Artist
```http
GET /art/user/:artistId
```

#### Get User's Liked Art
```http
GET /art/myLikes
Authorization: Bearer <access_token>
```

#### Get Trending Art
```http
GET /art/showTrending
```

#### Search Art by Tags
```http
GET /art/search/tags?tags=tag1,tag2,tag3
```

#### Get Art Statistics
```http
GET /art/stats/overview
```

#### Get Artist Leaderboard
```http
GET /art/leaderboard/artists
```

#### Get Top Art Pieces
```http
GET /art/leaderboard/artpieces
```

#### Get User Art Count
```http
GET /art/getUserArtCount
Authorization: Bearer <access_token>
```

### 💳 Order & Payment Endpoints

#### Create Payment Intent
```http
POST /orders/create-payment-intent
Authorization: Bearer <access_token>

Body:
{
  "artId": "art_object_id"
}
```

#### Stripe Webhook
```http
POST /orders/webhook
Content-Type: application/json

Body: Stripe webhook event data
```

### 🔗 Sharing Endpoints

#### Create Share Link
```http
POST /shareLink/art/:artId/share
Authorization: Bearer <access_token>
```

#### Get Shared Content
```http
GET /shareLink/share/:shareToken
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Access Token**: Short-lived token for API requests
2. **Refresh Token**: Long-lived token for getting new access tokens

### Protected Routes
Most routes require authentication. Include the access token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

### Token Refresh
When the access token expires, use the refresh token to get a new one via the `/users/refreshAccessToken` endpoint.

## 📁 File Upload

The API supports file uploads using Multer middleware:

- **Avatar Images**: Single file upload for user profiles
- **Cover Images**: Optional single file upload for user profiles
- **Art Images**: Multiple file upload (up to 5 images) for art pieces

All images are automatically uploaded to Cloudinary and the URLs are stored in the database.

## 💰 Payment Processing

The API integrates with Stripe for secure payment processing:

1. **Payment Intent Creation**: Creates a Stripe payment intent for art purchases
2. **Webhook Handling**: Processes Stripe webhook events to update order status
3. **Order Management**: Tracks order status and payment completion

## 🔍 Search & Filtering

The art search system supports:

- **Text Search**: Search in titles, descriptions, and tags
- **Art Form Filtering**: Filter by specific art forms
- **Sale Status**: Filter by whether art is for sale
- **Pagination**: Efficient data loading with page-based navigation
- **Sorting**: Sort by various fields (creation date, price, etc.)

## 📊 Analytics & Leaderboards

The API provides various analytics endpoints:

- **Art Statistics**: Overview of platform usage
- **Artist Leaderboard**: Top-performing artists
- **Trending Art**: Popular art pieces
- **User Art Counts**: Individual user statistics

## 🚨 Error Handling

The API uses a standardized error response format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error information"],
  "stack": "Error stack trace (development only)"
}
```

## 📝 Response Format

Successful responses follow this format:

```json
{
  "statusCode": 200,
  "data": "Response data",
  "message": "Success message",
  "success": true
}
```

## 🧪 Testing

To test the API endpoints, you can use tools like:

- **Postman**: For manual API testing
- **Insomnia**: Alternative API testing tool
- **cURL**: Command-line testing
- **Thunder Client**: VS Code extension for API testing

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

- Database connection strings
- JWT secrets
- Cloudinary credentials
- Stripe keys
- CORS origins

### Production Considerations
- Use HTTPS in production
- Set appropriate CORS origins
- Configure proper MongoDB indexes
- Set up monitoring and logging
- Use environment-specific configurations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation

## 🔄 API Versioning

Current API version: v1.0

All endpoints are prefixed with `/api/` and follow RESTful conventions.

---

**Note**: This documentation covers the current API implementation. For the most up-to-date information, refer to the source code and any additional documentation provided by the development team.
