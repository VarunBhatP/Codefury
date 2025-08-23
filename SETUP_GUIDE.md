# Codefury Backend - Quick Setup Guide

## 🚀 Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
# Check Node.js version (should be 16+)
node --version

# Check npm version
npm --version

# Check if MongoDB is running (if local)
mongod --version
```

### 2. Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd Codefury

# Install dependencies
npm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp env_sample.txt .env

# Edit .env file with your credentials
nano .env  # or use your preferred editor
```

**Required Environment Variables:**
```env
# Server Configuration
PORT=8080
CORS_ORIGIN=*

# Database
DB_NAME=codefury_db
MONGO_URI=mongodb://localhost:27017/codefury_db

# JWT Secrets (generate secure random strings)
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary (get from cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe (get from stripe.com)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

### 4. Start the Server
```bash
# Development mode with auto-restart
npm start

# Or production mode
node src/index.js
```

**Server should start at:** `http://localhost:8080`

### 5. Test the API
```bash
# Test if server is running
curl http://localhost:8080/api/art/getAllArt

# Expected response: JSON with art data or empty array
```

## 🔧 Detailed Setup

### MongoDB Setup

#### Option A: Local MongoDB
```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Check status
sudo systemctl status mongodb
```

#### Option B: MongoDB Atlas (Cloud)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for free account
3. Get credentials from dashboard
4. Update `.env` file

### Stripe Setup
1. Go to [Stripe](https://stripe.com/)
2. Create account
3. Get API keys from dashboard
4. Set up webhook endpoint: `http://your-domain.com/api/orders/webhook`

## 📁 Project Structure
```
Codefury/
├── src/
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Auth & file upload
│   ├── Utils/         # Helper functions
│   ├── app.js         # Express app setup
│   └── index.js       # Server entry point
├── .env               # Environment variables
├── package.json       # Dependencies
└── README.md          # Full documentation
```

## 🧪 Testing the Setup

### 1. Test User Registration
```bash
curl -X POST http://localhost:8080/api/users/register \
  -F "userName=testuser" \
  -F "email=test@example.com" \
  -F "password=password123" \
  -F "avatar=@/path/to/test-image.jpg"
```

### 2. Test User Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Test Art Creation (with token from login)
```bash
curl -X POST http://localhost:8080/api/art/createArt \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -F "title=Test Art" \
  -F "description=Test description" \
  -F "artForm=Warli" \
  -F "images=@/path/to/art-image.jpg"
```

## 🚨 Common Issues & Solutions

### Issue: "MongoDB connection failed"
**Solution:**
- Check if MongoDB is running
- Verify connection string in `.env`
- Check network/firewall settings

### Issue: "Cloudinary upload failed"
**Solution:**
- Verify Cloudinary credentials in `.env`
- Check internet connection
- Verify file format and size

### Issue: "JWT token invalid"
**Solution:**
- Check token expiration
- Verify JWT secrets in `.env`
- Ensure token format: `Bearer <token>`

### Issue: "Port already in use"
**Solution:**
```bash
# Find process using port 8080
lsof -i :8080

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=8081
```

### Issue: "File upload too large"
**Solution:**
- Check file size limits in multer config
- Compress images before upload
- Update multer limits if needed

## 🔒 Security Checklist

- [ ] JWT secrets are strong and unique
- [ ] CORS origins are properly configured
- [ ] File upload validation is enabled
- [ ] Input sanitization is implemented
- [ ] Rate limiting is configured (recommended)
- [ ] HTTPS is enabled in production

## 📊 Monitoring Setup

### Basic Logging
```bash
# View server logs
tail -f logs/app.log

# Monitor MongoDB
mongo --eval "db.serverStatus()"
```

### Health Check Endpoint
```bash
# Add to your app.js
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

# Test health
curl http://localhost:8080/health
```

## 🚀 Production Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=80
CORS_ORIGIN=https://yourdomain.com
```

### Process Management
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/index.js --name "codefury-api"

# Monitor
pm2 status
pm2 logs codefury-api
```

### Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📚 Next Steps

1. **Read the full documentation**: `README.md`
2. **Explore API endpoints**: `API_DOCUMENTATION.md`
3. **Set up frontend integration**
4. **Configure monitoring and logging**
5. **Set up CI/CD pipeline**
6. **Implement testing suite**

## 🆘 Getting Help

- **Documentation**: Check `README.md` and `API_DOCUMENTATION.md`
- **Issues**: Create GitHub issue with error details
- **Community**: Join our developer community
- **Support**: Contact the development team

---

**Happy Coding! 🎨✨**
