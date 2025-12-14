# System Architecture

This document describes the architecture, technology stack, and design patterns used in the CropShare application.

## System Overview

CropShare is a web-based platform that connects farmers with NGOs for crop donation and distribution. The system enables direct communication, logistics coordination, and impact tracking between agricultural producers and humanitarian organizations.

## Technology Stack

### Frontend
- **Framework**: React 19+ with Vite
- **Language**: JavaScript (ES6+)
- **Styling**: CSS Modules with custom properties
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Real-time Communication**: Socket.io-client
- **Icons**: React Icons (Fi/Md/Wi collections)
- **Internationalization**: Google Translate integration

### Backend
- **Runtime**: Node.js 20.13.1+
- **Framework**: Express.js
- **Language**: JavaScript (ES6+)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io
- **File Upload**: Multer
- **Security**: bcryptjs, helmet, cors
- **Validation**: Express-validator

### External Services
- **Weather API**: Real-time weather data and alerts
- **Email Service**: User notifications and verification
- **Translation**: Google Translate API
- **Hosting**: Configurable for various cloud providers

### Development Tools
- **Build Tool**: Vite (frontend), npm scripts (backend)
- **Linting**: ESLint
- **Version Control**: Git
- **Package Management**: npm
- **Testing**: Jest (planned)
- **Documentation**: Markdown files

## Architecture Patterns

### 1. Client-Server Architecture
- **Frontend**: Single Page Application (SPA)
- **Backend**: RESTful API with real-time capabilities
- **Communication**: HTTP/HTTPS + WebSocket

### 2. Component-Based Architecture
- **Modular Components**: Reusable UI components
- **Separation of Concerns**: Logic, styling, and markup separation
- **Composition**: Component composition patterns

### 3. Layered Architecture (Backend)
- **Routes Layer**: Request routing and middleware
- **Controller Layer**: Business logic and request handling
- **Model Layer**: Data persistence and validation
- **Service Layer**: External integrations and utilities

### 4. State Management
- **Local State**: React useState/useEffect hooks
- **Global State**: React Context API
- **Server State**: API calls with loading/error states

## Data Flow Architecture

### User Authentication Flow
1. User submits login/registration form
2. Frontend validates input and sends to API
3. Backend validates credentials and generates JWT
4. Token stored in localStorage and HTTP-only cookies
5. Subsequent requests include JWT in Authorization header
6. Backend validates token on protected routes

### Crop Donation Flow
1. Farmer creates crop listing via form
2. Data validated and stored in MongoDB
3. NGO browses marketplace and sends request
4. Farmer receives notification and approves/rejects
5. Upon approval, pickup request initiated
6. Logistics coordination via chat system
7. Completion confirmation and impact tracking

### Real-time Communication Flow
1. User establishes WebSocket connection
2. Messages sent via Socket.io events
3. Server broadcasts to recipient
4. Frontend updates UI in real-time
5. Message history stored in database

## Database Design

### Core Entities

#### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: Enum ['farmer', 'ngo'],
  location: String,
  phone: String,
  profileImage: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Crop Model
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId (ref: User),
  name: String,
  description: String,
  quantity: Number,
  unit: String,
  location: String,
  images: [String],
  price: Number (optional),
  category: String,
  harvestDate: Date,
  expiryDate: Date,
  status: Enum ['available', 'donated', 'sold'],
  createdAt: Date,
  updatedAt: Date
}
```

#### Request Model
```javascript
{
  _id: ObjectId,
  cropId: ObjectId (ref: Crop),
  farmerId: ObjectId (ref: User),
  ngoId: ObjectId (ref: User),
  message: String,
  status: Enum ['pending', 'accepted', 'rejected'],
  createdAt: Date,
  updatedAt: Date
}
```

#### Message Model
```javascript
{
  _id: ObjectId,
  senderId: ObjectId (ref: User),
  receiverId: ObjectId (ref: User),
  content: String,
  type: Enum ['text', 'image'],
  read: Boolean,
  createdAt: Date
}
```

#### Pickup Model
```javascript
{
  _id: ObjectId,
  farmerId: ObjectId (ref: User),
  ngoId: ObjectId (ref: User),
  cropId: ObjectId (ref: Crop),
  location: String,
  datetime: Date,
  instructions: String,
  status: Enum ['scheduled', 'in_transit', 'completed', 'cancelled'],
  createdAt: Date,
  updatedAt: Date
}
```

### Database Relationships
- **One-to-Many**: User → Crops, User → Messages
- **Many-to-Many**: Users (farmers) ↔ Users (NGOs) via Requests
- **Referential Integrity**: Foreign keys with population

## API Architecture

### RESTful Endpoints Structure
```
GET    /api/auth/profile          # Get user profile
POST   /api/auth/register         # User registration
POST   /api/auth/login            # User authentication

GET    /api/crops                 # List crops with filters
POST   /api/crops                 # Create crop listing
GET    /api/crops/:id             # Get specific crop
PUT    /api/crops/:id             # Update crop
DELETE /api/crops/:id             # Delete crop

GET    /api/requests              # Get user requests
POST   /api/requests              # Send crop request
PUT    /api/requests/:id          # Update request status

GET    /api/messages/:userId      # Get conversation
POST   /api/messages              # Send message

GET    /api/pickups               # Get pickups
POST   /api/pickups               # Create pickup
PUT    /api/pickups/:id           # Update pickup status
```

### API Response Format
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "errors": null
}
```

### Error Handling
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error (unexpected errors)

## Security Architecture

### Authentication & Authorization
- JWT tokens with expiration
- Password hashing with bcrypt
- Role-based access control
- Route protection middleware

### Data Protection
- Input sanitization and validation
- SQL injection prevention (MongoDB)
- XSS protection
- CORS configuration
- Rate limiting

### File Upload Security
- File type validation
- Size limits
- Secure file naming
- Storage access controls

## Performance Considerations

### Frontend Optimization
- Code splitting with React.lazy
- Image optimization and lazy loading
- Bundle analysis and tree shaking
- Service worker for caching
- CDN for static assets

### Backend Optimization
- Database indexing
- Query optimization
- Caching strategies (Redis planned)
- Compression middleware
- Connection pooling

### Real-time Performance
- Socket.io clustering for scalability
- Message queuing for high load
- Connection limits and cleanup
- Efficient event broadcasting

## Scalability Architecture

### Horizontal Scaling
- Stateless backend design
- Database read replicas
- Load balancer configuration
- Session storage externalization

### Microservices Preparation
- Modular controller structure
- Service separation planning
- API gateway ready design
- Event-driven architecture foundation

## Monitoring & Logging

### Application Monitoring
- Error tracking and reporting
- Performance metrics collection
- User analytics integration
- Health check endpoints

### Logging Strategy
- Structured logging with Winston
- Log levels (error, warn, info, debug)
- Centralized log aggregation
- Audit trail for sensitive operations

## Deployment Architecture

### Development Environment
- Local development servers
- Hot reloading for frontend
- Auto-restart for backend
- Development database

### Production Environment
- Containerized deployment (Docker)
- Reverse proxy (nginx)
- SSL/TLS termination
- Environment-based configuration
- Backup and recovery procedures

## Future Architecture Considerations

### Planned Enhancements
- GraphQL API implementation
- Microservices migration
- Advanced caching layer
- Machine learning integration
- Mobile application development
- Multi-region deployment

### Technology Upgrades
- React Server Components
- TypeScript migration
- Advanced state management
- Progressive Web App features
- Advanced security implementations