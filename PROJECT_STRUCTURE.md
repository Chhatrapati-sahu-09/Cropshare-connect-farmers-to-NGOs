# Project Structure

This document outlines the organization and structure of the CropShare project.

## Root Directory

```
CropShare/
├── client/                 # React frontend application
├── server/                 # Node.js/Express backend API
├── README.md              # Project documentation
├── package.json           # Root package.json (if monorepo)
└── .gitignore            # Git ignore rules
```

## Frontend Structure (client/)

```
client/
├── public/                # Static assets
│   ├── index.html        # Main HTML template
│   └── assets/           # Images, icons, etc.
├── src/
│   ├── components/       # Reusable React components
│   │   ├── CropCard.jsx          # Crop display component
│   │   ├── CropForm.jsx          # Crop creation form
│   │   ├── DashboardLayout.jsx   # Dashboard layout wrapper
│   │   ├── EcosystemPartners.jsx # NGO partners display
│   │   ├── Footer.jsx            # Site footer
│   │   ├── Loader.jsx            # Loading spinner
│   │   ├── Navbar.jsx            # Navigation bar
│   │   ├── PickupOperations.jsx  # Pickup management
│   │   └── WeatherCard.jsx       # Weather information
│   ├── pages/            # Page components
│   │   ├── DashboardHome.jsx     # Main dashboard
│   │   ├── AddCropPage.jsx       # Add crop page
│   │   ├── BrowseCrops.jsx       # Crop marketplace
│   │   ├── ChatPage.jsx          # Messaging interface
│   │   ├── DonatePage.jsx        # NGO donation page
│   │   ├── Home.jsx              # Landing page
│   │   ├── Login.jsx             # Authentication
│   │   └── MapPage.jsx           # Location/map view
│   ├── context/          # React context providers
│   │   ├── AuthContext.jsx       # Authentication state
│   │   └── NotificationContext.jsx # Notifications
│   ├── hooks/            # Custom React hooks
│   │   ├── useAuth.js            # Authentication hook
│   │   └── useNotifications.js   # Notification hook
│   ├── routes/           # Route definitions
│   ├── services/         # API service functions
│   │   └── api.js               # API client
│   ├── styles/           # CSS stylesheets
│   │   ├── DashboardHome.css    # Dashboard styles
│   │   └── [component].css      # Component styles
│   ├── utils/            # Utility functions
│   ├── i18n/             # Internationalization
│   └── main.jsx          # Application entry point
├── package.json          # Frontend dependencies
├── vite.config.js        # Vite configuration
└── eslint.config.js      # ESLint configuration
```

## Backend Structure (server/)

```
server/
├── config/               # Configuration files
│   └── db.js            # Database connection
├── controllers/         # Route controllers
│   ├── authController.js    # Authentication logic
│   ├── cropController.js    # Crop management
│   ├── messageController.js # Messaging
│   ├── requestController.js # Request handling
│   └── userController.js    # User management
├── middleware/          # Express middleware
│   └── authMiddleware.js    # Authentication middleware
├── models/             # Mongoose models
│   ├── User.js         # User schema
│   ├── Crop.js         # Crop schema
│   ├── Message.js      # Message schema
│   ├── Request.js      # Request schema
│   └── Pickup.js       # Pickup schema
├── routes/             # API route definitions
│   ├── authRoutes.js   # Authentication routes
│   ├── cropRoutes.js   # Crop routes
│   ├── messageRoutes.js # Message routes
│   ├── requestRoutes.js # Request routes
│   ├── pickupRoutes.js # Pickup routes
│   └── uploadRoutes.js # File upload routes
├── utils/              # Backend utilities
│   └── generateToken.js # JWT token generation
├── server.js           # Main server file
└── package.json        # Backend dependencies
```

## Key Directories Explanation

### Components (`client/src/components/`)
- Reusable UI components
- Each component has its own CSS file
- Follows component composition patterns

### Pages (`client/src/pages/`)
- Top-level page components
- Correspond to routes in the application
- Handle page-level state and logic

### Services (`client/src/services/`)
- API communication layer
- Centralized HTTP requests
- Error handling and response processing

### Controllers (`server/controllers/`)
- Business logic for API endpoints
- Input validation and processing
- Database operations

### Models (`server/models/`)
- MongoDB schema definitions
- Data validation rules
- Model relationships

### Routes (`server/routes/`)
- Express route definitions
- Middleware application
- Route organization by feature

## File Naming Conventions

- **Components**: PascalCase (e.g., `CropCard.jsx`)
- **Pages**: PascalCase with "Page" suffix (e.g., `AddCropPage.jsx`)
- **Styles**: Component name + `.css` (e.g., `CropCard.css`)
- **Utilities**: camelCase (e.g., `generateToken.js`)
- **Routes/Controllers**: camelCase with feature prefix (e.g., `cropController.js`)

## Development Guidelines

- Keep components small and focused
- Use CSS modules for component styling
- Place shared utilities in `utils/` directories
- Follow RESTful API conventions
- Maintain separation of concerns between frontend and backend