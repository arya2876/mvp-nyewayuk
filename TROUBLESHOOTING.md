# Troubleshooting Guide

This guide helps you resolve common errors you may encounter while using the application.

## Common Errors and Solutions

### 1. Image Upload Errors

#### "Image upload service is not configured"
**Cause**: EdgeStore credentials are missing from environment variables.

**Solution**:
1. Make sure you have set up an EdgeStore account at https://edgestore.dev/
2. Add the following to your `.env` file:
   ```
   EDGE_STORE_ACCESS_KEY=your-access-key
   EDGE_STORE_SECRET_KEY=your-secret-key
   ```
3. Restart your development server

#### "Cannot connect to image upload service"
**Cause**: Network connectivity issues or EdgeStore service is down.

**Solution**:
1. Check your internet connection
2. Try again in a few minutes
3. If the problem persists, check EdgeStore status at https://status.edgestore.dev/

#### "Image size must be less than 5MB"
**Cause**: The selected image file is too large.

**Solution**:
1. Compress your image using online tools like TinyPNG or ImageOptim
2. Select a smaller image file
3. Use image editing software to reduce the file size

#### "Please select a valid image file"
**Cause**: The selected file is not a valid image format.

**Solution**:
1. Ensure your file is in a supported format (JPG, PNG, GIF, WebP)
2. Check that the file extension matches the actual file type

### 2. Authentication Errors

#### "Invalid credentials"
**Cause**: Incorrect email or password.

**Solution**:
1. Double-check your email address
2. Ensure your password is correct (passwords are case-sensitive)
3. Try the "Reset Password" option if available

#### "User with this email already exists"
**Cause**: Attempting to register with an email that's already registered.

**Solution**:
1. Use the login form instead of registration
2. If you forgot your password, use the password reset option
3. Try logging in with Google or GitHub if you previously registered with those services

#### Login successful but page doesn't refresh
**Cause**: Browser cache or session issues.

**Solution**:
1. Clear your browser cache and cookies
2. Try logging in again
3. If using Vercel deployment, ensure NEXTAUTH_URL is set correctly in environment variables

### 3. Database Connection Errors

#### "Missing DATABASE_URL"
**Cause**: MongoDB connection string is not configured.

**Solution**:
1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Add your connection string to `.env`:
   ```
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/databasename"
   ```
3. Run `npx prisma generate` to regenerate the Prisma client
4. Restart your development server

### 4. Listing Creation Errors

#### "Please fill in all required fields"
**Cause**: Required form fields are empty or invalid.

**Solution**:
1. Ensure all steps in the listing creation form are completed:
   - Category selection
   - Location (must include region, country, and coordinates)
   - Brand, model, and condition information
   - Main image upload
   - NyewaGuard verification image (optional)
   - Title and description
   - Price (must be a positive number)
2. Double-check that images have been successfully uploaded before proceeding

#### "Invalid data"
**Cause**: Form data doesn't meet validation requirements.

**Solution**:
1. Verify all text fields contain valid information
2. Ensure price is a valid number greater than 0
3. Confirm that images have been uploaded successfully (you should see the image preview)
4. Make sure location is properly selected from the dropdown

### 5. Development Environment Issues

#### Build fails with "Failed to fetch font from Google Fonts"
**Cause**: No internet access or Google Fonts is blocked.

**Solution**:
1. This error is expected in CI/CD environments without internet access
2. For local development, check your internet connection
3. If behind a corporate firewall, you may need to configure proxy settings
4. The application will work fine in production on Vercel

#### "Service Unavailable" errors in development
**Cause**: Missing environment variables or services not configured.

**Solution**:
1. Copy `.env.example` to `.env` and fill in all required values
2. At minimum, you need:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NEXT_PUBLIC_SERVER_URL`
3. Optional services (EdgeStore, Stripe, OAuth) can be added as needed

### 6. Deployment Issues on Vercel

#### 500 Internal Server Error after deployment
**Cause**: Missing environment variables in Vercel.

**Solution**:
1. Go to your Vercel project settings
2. Navigate to Environment Variables
3. Add all required environment variables from your `.env` file
4. Redeploy your application

#### OAuth login doesn't work on Vercel
**Cause**: OAuth redirect URLs not configured correctly.

**Solution**:
1. Update OAuth provider settings (Google/GitHub) with your Vercel domain
2. Set `NEXTAUTH_URL` to your Vercel deployment URL:
   ```
   NEXTAUTH_URL="https://your-app.vercel.app"
   ```
3. Ensure callback URLs in OAuth providers include:
   - `https://your-app.vercel.app/api/auth/callback/google`
   - `https://your-app.vercel.app/api/auth/callback/github`

## Getting Help

If you continue to experience issues after trying these solutions:

1. Check the browser console for detailed error messages
2. Review server logs in Vercel dashboard (for production issues)
3. Open an issue on the GitHub repository with:
   - Description of the problem
   - Steps to reproduce
   - Error messages or screenshots
   - Your environment (browser, OS, etc.)

## Health Check Endpoint

You can verify your deployment health by visiting `/api/health`. This endpoint shows:
- Database connection status
- Missing environment variables
- Service configuration status (EdgeStore, Stripe)

Example response:
```json
{
  "ok": true,
  "env": {
    "missing": [],
    "stripeConfigured": false,
    "edgeStoreConfigured": true
  },
  "db": "connected"
}
```
