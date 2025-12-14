# Setup Guide

This guide provides step-by-step instructions for setting up the CropShare development environment.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js**: Version 20.13.1 or higher
- **MongoDB**: Version 4.4 or higher (local installation or MongoDB Atlas)
- **Git**: Version control system
- **npm**: Package manager (comes with Node.js)

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: 2GB free space for installation and dependencies

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/Chhatrapati-sahu-09/Cropshare-connect-farmers-to-NGOs.git
cd Cropshare-connect-farmers-to-NGOs
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

This will install all backend dependencies including:
- Express.js for the web framework
- Mongoose for MongoDB integration
- Socket.io for real-time communication
- JWT for authentication
- Other security and utility packages

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

This will install all frontend dependencies including:
- React for the UI framework
- Vite for the build tool
- Axios for HTTP requests
- React Router for navigation
- Socket.io-client for real-time features
- React Icons for UI icons

### Step 4: Set Up Environment Variables

#### Backend Environment Setup

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cropshare

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Email Configuration (for notifications)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# External API Keys
WEATHER_API_KEY=your_weather_api_key
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

#### Frontend Environment Setup

Create a `.env` file in the `client/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000

# Google Translate (optional)
VITE_GOOGLE_TRANSLATE_KEY=your_google_translate_key
```

### Step 5: Set Up MongoDB

#### Option A: Local MongoDB Installation

1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com)
2. Start MongoDB service:
   - Windows: `net start MongoDB`
   - macOS: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGODB_URI` in `.env`

### Step 6: Start Development Servers

#### Start Backend Server

```bash
cd server
npm start
```

The server will start on `http://localhost:5000`

#### Start Frontend Development Server

Open a new terminal window:

```bash
cd client
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Verification Steps

### Test Backend Connection

1. Open browser and visit `http://localhost:5000/api/health`
2. Should return a success message

### Test Frontend Application

1. Open browser and visit `http://localhost:5173`
2. Should load the CropShare homepage
3. Try registering a new account
4. Verify database connection by checking MongoDB

### Test Real-time Features

1. Open two browser windows
2. Register two users (one farmer, one NGO)
3. Test chat functionality between users

## Troubleshooting

### Common Issues and Solutions

#### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

#### MongoDB Connection Error
- Ensure MongoDB service is running
- Check connection string in `.env`
- Verify network connectivity for Atlas

#### npm Install Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Build Errors
```bash
# Clear Vite cache
cd client
rm -rf node_modules/.vite
npm run dev
```

### Environment Variable Issues

- Ensure `.env` files are in correct directories
- No spaces around `=` in environment variables
- Restart servers after changing `.env` files
- Never commit `.env` files to version control

### Network Issues

- Check firewall settings
- Verify proxy configuration
- Ensure ports 5000 and 5173 are available

## Development Commands

### Backend Commands
```bash
cd server
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests (when implemented)
npm run lint       # Run ESLint
```

### Frontend Commands
```bash
cd client
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## Project Structure Overview

After setup, your project structure should look like:

```
CropShare/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   └── package.json
├── server/          # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── .gitignore
└── README.md
```

## Next Steps

1. **Explore the Codebase**: Review the main files in each directory
2. **Understand the API**: Check `server/routes/` for available endpoints
3. **Test Core Features**: Try user registration, crop listing, and messaging
4. **Customize Configuration**: Adjust settings for your development needs
5. **Contribute**: Follow the workflow in `WORKFLOW.md`

## Getting Help

- Check the `README.md` for project overview
- Review `ARCHITECTURE.md` for system design
- Check `WORKFLOW.md` for development processes
- Create issues on GitHub for bugs or questions

## Production Deployment

For production deployment, additional steps are required:

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up SSL certificates
4. Configure reverse proxy
5. Set up monitoring and logging
6. Implement backup strategies

See the deployment section in `README.md` for detailed instructions.