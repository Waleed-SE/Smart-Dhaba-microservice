# Smart-Dhaba

Smart-Dhaba is a comprehensive food ordering and management system designed for university canteens, providing an efficient digital solution for placing orders, managing tables, and streamlining the overall dining experience.

## Project Overview

Smart-Dhaba is a microservice-based application consisting of:

- **Authentication Service**: Handles user registration, login, and authentication
- **Order Service**: Manages food ordering, processing, and tracking
- **Menu Service**: Handles menu items, availability, and customization
- **User Management**: Manages different user roles (students, faculty, servers, admins)
- **Group Ordering**: Facilitates group orders for enhanced social dining experience
- **Real-time Notifications**: Provides updates on order status and availability

## Key Features

- User authentication and role-based access control
- Digital menu with customization options
- Individual and group ordering
- Real-time order tracking
- Rating and feedback system
- Server assignment and table management
- Admin dashboard for analytics and management
- Real-time chat for group coordination
- Location tracking for food delivery

## Tech Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Socket.io** - Real-time communication

### Frontend

- **React.js** - UI library
- **Vite** - Build tool
- **Context API** - State management
- **Axios** - HTTP client
- **Material-UI** - Component library

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy

## Project Structure

The project follows a microservice architecture with the following components:

```
Smart-Dhaba-microservice/
├── smart-dhabba-backend/         # Backend services
│   ├── microservices/            # Individual microservices
│   │   ├── auth-service/         # Authentication microservice
│   │   └── order-service/        # Order management microservice
│   ├── models/                   # Database models
│   ├── controllers/              # Request handlers
│   ├── routes/                   # API routes
│   ├── middleware/               # Middleware functions
│   ├── services/                 # Business logic services
│   ├── sockets/                  # Socket.io configuration
│   └── utils/                    # Utility functions
│
├── smart-dhabba-frontend/        # Frontend application
│   └── smart-dhabba/             # React application
│       ├── src/                  # Source code
│       │   ├── components/       # Reusable UI components
│       │   ├── pages/            # Page components
│       │   ├── context/          # React Context providers
│       │   ├── services/         # API communication
│       │   └── styles/           # CSS/styling files
│       └── public/               # Static assets
│
├── Database schema.md            # Database schema documentation
└── Deployment instructions.md    # Deployment guide
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (v4.4+ recommended)
- Docker and Docker Compose (for containerized deployment)
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Smart-Dhaba-microservice
   ```

2. **Backend Setup**

   ```bash
   cd smart-dhabba-backend
   npm install
   ```

   Create a `.env` file with necessary environment variables:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/smart-dhaba
   JWT_SECRET=your_jwt_secret
   ```

3. **Frontend Setup**

   ```bash
   cd ../smart-dhabba-frontend/smart-dhabba
   npm install
   ```

   Create a `.env` file:

   ```
   VITE_API_URL=http://localhost:3000/api
   ```

### Running the Application

#### Development Mode

1. **Start the backend server**

   ```bash
   cd smart-dhabba-backend
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd ../smart-dhabba-frontend/smart-dhabba
   npm run dev
   ```

#### Using Docker Compose

```bash
cd smart-dhabba-backend
docker-compose up -d
```

## API Documentation

For detailed API documentation, refer to the [API_DOCUMENTATION.md](./smart-dhabba-backend/API_DOCUMENTATION.md) file.

## Database Schema

For detailed information about the database schema, refer to the [Database schema.md](./Database%20schema.md) file.

## Deployment Instructions

For detailed deployment instructions, refer to the [Deployment instructions.md](./Deployment%20instructions.md) file.

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- All contributors who have helped shape this project
- University Canteen Management for their input and feedback
- Open source community for various libraries and tools used
