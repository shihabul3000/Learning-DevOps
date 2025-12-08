# Todo App Frontend

A modern React frontend for the Todo application with user management.

## Features

- **Authentication**: JWT-based login system
- **Role-based Access**: Admin and user roles with different permissions
- **Todo Management**: Create, read, update, delete todos
- **User Management**: Admin-only user management interface
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **React Query** for server state management
- **React Hook Form** for form handling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Axios** for API calls

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Auth/           # Authentication components
│   │   ├── Layout/         # Layout components
│   │   ├── Todos/          # Todo-related components
│   │   └── Users/          # User management components
│   ├── contexts/           # React contexts
│   ├── services/           # API service functions
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
└── package.json            # Dependencies and scripts
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

## API Integration

The frontend connects to the backend API running on `http://localhost:5000`. Make sure your backend server is running before starting the frontend.

### Available Routes

- `/login` - User authentication
- `/todos` - Todo list and management
- `/users` - User management (admin only)

## Environment Setup

The frontend is configured to proxy API requests to the backend server. No additional environment variables are required for basic setup.

## Authentication Flow

1. User logs in with email/password
2. Backend returns JWT token and user data
3. Token is stored in localStorage
4. Token is automatically included in API requests
5. Protected routes check authentication status
6. Admin routes additionally check user role

## Component Architecture

### Modular Design
- **Services**: Separate API logic from components
- **Contexts**: Global state management for authentication
- **Protected Routes**: Route-level access control
- **Reusable Components**: Consistent UI patterns

### State Management
- **React Query**: Server state, caching, and synchronization
- **React Context**: Authentication and user state
- **React Hook Form**: Form state and validation