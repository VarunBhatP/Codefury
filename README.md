# Codefury API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [User Management](#user-management)
4. [Art Management](#art-management)
5. [Order & Payment](#order--payment)
6. [Sharing System](#sharing-system)
7. [Error Handling](#error-handling)
8. [Testing Examples](#testing-examples)

## Overview

The Codefury API is a RESTful service that provides endpoints for managing an art marketplace platform. The API supports traditional Indian art forms and includes features like user management, art creation, payment processing, and social interactions.

**Base URL**: `http://localhost:8080/api`
**Content-Type**: `application/json` (except for file uploads)
**Authentication**: JWT Bearer Token

## Authentication

### JWT Token Structure
- **Access Token**: Short-lived (1 day) for API requests
- **Refresh Token**: Long-lived (7 days) for token renewal

### Token Usage
```http
Authorization: Bearer <access_token>
```

### Token Refresh Flow
1. Access token expires
2. Call `/users/refreshAccessToken` with refresh token
3. Receive new access token
4. Continue with API requests

## User Management

### 1. User Registration

**Endpoint**: `POST /users/register`

**Description**: Creates a new user account with avatar upload

**Request**:
```http
POST /api/users/register
Content-Type: multipart/form-data

Form Data:
- userName: "artist123"
- email: "artist@example.com"
- password: "securePassword123"
- avatar: [file] (required)
- coverImage: [file] (optional)
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userName": "artist123",
    "email": "artist@example.com",
    "avatar": "https://res.cloudinary.com/cloud_name/image/upload/v123/avatar.jpg",
    "coverImage": "https://res.cloudinary.com/cloud_name/image/upload/v123/cover.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "User created successfully: User: {...}",
  "success": true
}
```

**Response (Error - 400)**:
```json
{
  "success": false,
  "message": "Username/Email already exists!",
  "errors": [],
  "stack": "Error stack trace (development only)"
}
```

### 2. User Login

**Endpoint**: `POST /users/login`

**Description**: Authenticates user and returns access/refresh tokens

**Request**:
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "artist@example.com",
  "password": "securePassword123"
}
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "userName": "artist123",
      "email": "artist@example.com",
      "avatar": "https://res.cloudinary.com/cloud_name/image/upload/v123/avatar.jpg"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User logged in successfully",
  "success": true
}
```

### 3. Update Password

**Endpoint**: `POST /users/updatePassword`

**Description**: Updates user password (requires authentication)

**Request**:
```http
POST /api/users/updatePassword
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "oldPassword": "securePassword123",
  "newPassword": "newSecurePassword456"
}
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": null,
  "message": "Password updated successfully",
  "success": true
}
```

## Art Management

### 1. Create Art Piece

**Endpoint**: `POST /art/createArt`

**Description**: Creates a new art piece with image uploads

**Request**:
```http
POST /api/art/createArt
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- title: "Traditional Warli Painting"
- description: "A beautiful Warli art piece depicting village life"
- artForm: "Warli"
- price: "1500"
- isForSale: "true"
- tags: "traditional,warli,village,india"
- images: [file1, file2, file3] (max 5)
```

**Response (Success - 201)**:
```json
{
  "statusCode": 201,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Traditional Warli Painting",
    "description": "A beautiful Warli art piece depicting village life",
    "artForm": "Warli",
    "images": [
      "https://res.cloudinary.com/cloud_name/image/upload/v123/art1.jpg",
      "https://res.cloudinary.com/cloud_name/image/upload/v123/art2.jpg",
      "https://res.cloudinary.com/cloud_name/image/upload/v123/art3.jpg"
    ],
    "price": 1500,
    "isForSale": true,
    "artist": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "userName": "artist123",
      "avatar": "https://res.cloudinary.com/cloud_name/image/upload/v123/avatar.jpg"
    },
    "tags": ["traditional", "warli", "village", "india"],
    "likes": [],
    "comments": [],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Art piece created successfully!",
  "success": true
}
```

### 2. Get All Art Pieces

**Endpoint**: `GET /art/getAllArt`

**Description**: Retrieves art pieces with pagination, filtering, and sorting

**Request**:
```http
GET /api/art/getAllArt?page=1&limit=10&artForm=Warli&isForSale=true&search=traditional&sortBy=price&sortOrder=asc
```

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `artForm`: Filter by art form ("Warli", "Pithora", "Madhubani", "Other")
- `isForSale`: Filter by sale status (true/false)
- `search`: Search in title, description, and tags
- `sortBy`: Sort field (createdAt, price, title, likes)
- `sortOrder`: Sort order (asc/desc)

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "arts": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "Traditional Warli Painting",
        "description": "A beautiful Warli art piece depicting village life",
        "artForm": "Warli",
        "images": ["https://res.cloudinary.com/cloud_name/image/upload/v123/art1.jpg"],
        "price": 1500,
        "isForSale": true,
        "artist": {
          "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
          "userName": "artist123",
          "avatar": "https://res.cloudinary.com/cloud_name/image/upload/v123/avatar.jpg"
        },
        "likes": [],
        "comments": [],
        "tags": ["traditional", "warli", "village", "india"],
        "createdAt": "2024-01-15T10:30:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  },
  "message": "Art pieces retrieved successfully",
  "success": true
}
```

### 3. Like/Unlike Art

**Endpoint**: `PATCH /art/likeArt/:artId`

**Description**: Toggles like status for an art piece

**Request**:
```http
PATCH /api/art/likeArt/64f8a1b2c3d4e5f6a7b8c9d1
Authorization: Bearer <access_token>
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "message": "Art piece liked successfully",
    "isLiked": true
  },
  "message": "Like status updated successfully",
  "success": true
}
```

### 4. Add Comment

**Endpoint**: `POST /art/addComment/:artId`

**Description**: Adds a comment to an art piece

**Request**:
```http
POST /api/art/addComment/64f8a1b2c3d4e5f6a7b8c9d1
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "Beautiful traditional art! Love the colors and composition."
}
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
    "user": "64f8a1b2c3d4e5f6a7b8c9d0",
    "text": "Beautiful traditional art! Love the colors and composition.",
    "createdAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Comment added successfully",
  "success": true
}
```

### 5. Get Trending Art

**Endpoint**: `GET /art/showTrending`

**Description**: Retrieves trending art pieces based on likes and engagement

**Request**:
```http
GET /api/art/showTrending
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "trendingArts": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "title": "Traditional Warli Painting",
        "artForm": "Warli",
        "images": ["https://res.cloudinary.com/cloud_name/image/upload/v123/art1.jpg"],
        "likes": 25,
        "comments": 8,
        "artist": {
          "userName": "artist123",
          "avatar": "https://res.cloudinary.com/cloud_name/image/upload/v123/avatar.jpg"
        }
      }
    ]
  },
  "message": "Trending art pieces retrieved successfully",
  "success": true
}
```

## Order & Payment

### 1. Create Payment Intent

**Endpoint**: `POST /orders/create-payment-intent`

**Description**: Creates a Stripe payment intent for art purchase

**Request**:
```http
POST /api/orders/create-payment-intent
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "artId": "64f8a1b2c3d4e5f6a7b8c9d1"
}
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "clientSecret": "pi_3OqJ8L2eZvKYlo2C1gFJQqXx_secret_abc123def456"
  },
  "message": "Payment Intent created successfully",
  "success": true
}
```

### 2. Stripe Webhook

**Endpoint**: `POST /orders/webhook`

**Description**: Handles Stripe webhook events (public endpoint)

**Request**:
```http
POST /api/orders/webhook
Content-Type: application/json
Stripe-Signature: t=1234567890,v1=abc123def456

{
  "id": "evt_1234567890",
  "type": "payment_intent.succeeded",
  "data": {
    "object": {
      "id": "pi_3OqJ8L2eZvKYlo2C1gFJQqXx",
      "amount": 150000,
      "currency": "inr"
    }
  }
}
```

**Response (Success - 200)**:
```json
{
  "received": true
}
```

## Sharing System

### 1. Create Share Link

**Endpoint**: `POST /shareLink/art/:artId/share`

**Description**: Creates a shareable link for an art piece

**Request**:
```http
POST /api/shareLink/art/64f8a1b2c3d4e5f6a7b8c9d1/share
Authorization: Bearer <access_token>
```

**Response (Success - 201)**:
```json
{
  "statusCode": 201,
  "data": {
    "shareUrl": "http://localhost:8080/api/shareLink/share/abc123def"
  },
  "message": "Share link created successfully!",
  "success": true
}
```

### 2. Get Shared Content

**Endpoint**: `GET /shareLink/share/:shareToken`

**Description**: Retrieves art content from a share link (public)

**Request**:
```http
GET /api/shareLink/share/abc123def
```

**Response (Success - 200)**:
```json
{
  "statusCode": 200,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "title": "Traditional Warli Painting",
    "description": "A beautiful Warli art piece depicting village life",
    "artForm": "Warli",
    "images": ["https://res.cloudinary.com/cloud_name/image/upload/v123/art1.jpg"],
    "artist": {
      "userName": "artist123",
      "avatar": "https://res.cloudinary.com/cloud_name/image/upload/v123/avatar.jpg"
    }
  },
  "message": "Shared content retrieved successfully!",
  "success": true
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error information"],
  "stack": "Error stack trace (development only)"
}
```

### Common HTTP Status Codes

| Status | Description | Common Causes |
|--------|-------------|---------------|
| 200 | Success | Request completed successfully |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input data, missing fields |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 500 | Internal Server Error | Server-side error |

### Common Error Messages

| Error Code | Message | Solution |
|------------|---------|----------|
| 400 | "Title, description, and art form are required!" | Provide all required fields |
| 400 | "Invalid art form. Must be one of: Warli, Pithora, Madhubani, Other" | Use valid art form value |
| 400 | "At least one image is required!" | Upload at least one image |
| 400 | "Username/Email already exists!" | Use different username/email |
| 400 | "Avatar Image is required!" | Upload avatar image |
| 401 | "Unauthorized request" | Include valid access token |
| 404 | "Art piece not found" | Check art ID validity |
| 500 | "Failed to upload image to Cloudinary" | Check Cloudinary configuration |

## Testing Examples

### 1. Complete User Flow

```bash
# 1. Register user
curl -X POST http://localhost:8080/api/users/register \
  -F "userName=testartist" \
  -F "email=test@example.com" \
  -F "password=password123" \
  -F "avatar=@avatar.jpg"

# 2. Login user
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Create art piece (use token from login)
curl -X POST http://localhost:8080/api/art/createArt \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=Test Art" \
  -F "description=Test description" \
  -F "artForm=Warli" \
  -F "images=@art1.jpg"

# 4. Get all art pieces
curl -X GET "http://localhost:8080/api/art/getAllArt?page=1&limit=10"
```

### 2. Postman Collection

Create a Postman collection with these requests:

**Environment Variables**:
- `baseUrl`: `http://localhost:8080/api`
- `accessToken`: Your JWT access token
- `userId`: User ID from registration
- `artId`: Art ID from creation

**Request Examples**:

1. **User Registration**
   - Method: POST
   - URL: `{{baseUrl}}/users/register`
   - Body: form-data with file uploads

2. **User Login**
   - Method: POST
   - URL: `{{baseUrl}}/users/login`
   - Body: raw JSON

3. **Create Art**
   - Method: POST
   - URL: `{{baseUrl}}/art/createArt`
   - Headers: Authorization: Bearer {{accessToken}}
   - Body: form-data with files

4. **Get All Art**
   - Method: GET
   - URL: `{{baseUrl}}/art/getAllArt?page=1&limit=10`

### 3. Testing Scenarios

**Authentication Tests**:
- Try accessing protected routes without token
- Test with expired token
- Test with invalid token format

**File Upload Tests**:
- Upload different image formats (JPG, PNG, GIF)
- Test file size limits
- Test without required files

**Validation Tests**:
- Submit forms with missing required fields
- Test invalid art form values
- Test invalid email formats

**Error Handling Tests**:
- Test with non-existent IDs
- Test duplicate username/email
- Test invalid MongoDB ObjectIds

### 4. Performance Testing

**Load Testing**:
```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8080/api/art/getAllArt

# Using Artillery
artillery run load-test.yml
```

**Load Test Configuration** (artillery.yml):
```yaml
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
  defaults:
    headers:
      Authorization: 'Bearer YOUR_TOKEN'

scenarios:
  - name: "Art API Load Test"
    requests:
      - get:
          url: "/api/art/getAllArt"
      - get:
          url: "/api/art/getAllArt?page=2&limit=20"
```

## Development Notes

### File Upload Limits
- **Avatar**: 1 file, max 5MB
- **Cover Image**: 1 file, max 5MB  
- **Art Images**: Up to 5 files, max 10MB each

### Database Indexes
Ensure these indexes exist for optimal performance:
```javascript
// User collection
db.users.createIndex({ "email": 1 })
db.users.createIndex({ "userName": 1 })

// Art collection
db.arts.createIndex({ "artist": 1 })
db.arts.createIndex({ "artForm": 1 })
db.arts.createIndex({ "isForSale": 1 })
db.arts.createIndex({ "createdAt": -1 })

// Share collection
db.shares.createIndex({ "shareToken": 1 })
```

### Security Considerations
- All passwords are hashed using bcrypt
- JWT tokens have expiration times
- File uploads are validated and sanitized
- CORS is configurable for production
- Input validation on all endpoints

### Monitoring & Logging
- Implement request logging middleware
- Monitor API response times
- Track error rates and types
- Set up alerts for critical failures
