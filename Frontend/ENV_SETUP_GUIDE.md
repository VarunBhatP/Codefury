# Frontend Environment Variables Setup Guide

## 🚨 **IMPORTANT: Frontend .env should ONLY contain PUBLIC keys**

Your Frontend `.env` file should be located at: `Frontend/.env`

## 📝 **Required Variables**

```env
# Stripe Configuration (PUBLIC key only)
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZA567BCD890EFG

# API Configuration
REACT_APP_API_BASE_URL=http://localhost:8000/api/v1

# Environment
NODE_ENV=development
```

## 🔑 **How to Get Your Stripe Publishable Key**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **API keys**
3. Copy the **Publishable key** (starts with `pk_test_` for testing)
4. **DO NOT copy the Secret key** (starts with `sk_test_`)

## ⚠️ **What NOT to Include in Frontend .env**

```env
# ❌ NEVER include these in Frontend .env:

# MongoDB (Backend only)
MONGODB_URI=mongodb://localhost:27017/database

# Cloudinary (Backend only)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Secret (Backend only)
STRIPE_SECRET_KEY=sk_test_your_secret_key

# JWT Secrets (Backend only)
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
```

## 📁 **File Structure**

```
Codefury-backend/
├── .env                    ← Backend secrets (MongoDB, Cloudinary, Stripe secret keys)
└── Frontend/
    ├── .env               ← Frontend public keys only (this file)
    ├── package.json
    └── src/
```

## 🔧 **Setup Steps**

1. **Rename the config file**:
   ```bash
   cd Frontend
   mv env.config .env
   ```

2. **Update the values** in `.env`:
   - Replace `pk_test_your_stripe_publishable_key_here` with your actual Stripe publishable key
   - Update API base URL if different from `http://localhost:8000/api/v1`

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

## ✅ **Verification**

After setup, you should see:
- ✅ Stripe checkout working in ShoppingCart component
- ✅ API calls to your backend working
- ✅ No console errors about missing environment variables

## 🚨 **Security Reminder**

- Frontend `.env` variables are **PUBLIC** and visible in browser
- Backend `.env` variables are **PRIVATE** and secure
- Never commit `.env` files to git (add to `.gitignore`)
- Use different keys for development and production

## 🆘 **Troubleshooting**

If you get errors:
1. Check that `.env` file is in the correct location (`Frontend/.env`)
2. Verify the Stripe key starts with `pk_test_` (not `sk_test_`)
3. Restart your development server after changes
4. Check browser console for specific error messages 