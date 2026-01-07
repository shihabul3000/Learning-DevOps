# Prisma Blog Server

A full-stack blog application backend built with Node.js, TypeScript, Express, Prisma ORM, and PostgreSQL. This server handles blog posts, comments, user authentication, and more.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing](#testing)
- [Contributing](#contributing)

## Features

- **User Authentication**: Email/password and Google OAuth using Better Auth
- **Blog Posts**: Create, read, update, delete posts with tags, thumbnails, and status management
- **Comments**: Nested comments system with approval/rejection
- **Email Verification**: Automated email verification for new users
- **Role-based Access**: User roles (USER, ADMIN) with different permissions
- **Pagination and Sorting**: Efficient data retrieval for posts and comments
- **CORS Support**: Configured for frontend integration

## Tech Stack

- **Backend**: Node.js, TypeScript, Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **Email**: Nodemailer with Gmail SMTP
- **Package Manager**: pnpm
- **Development**: tsx for hot reloading

## Project Structure

```
prisma-blog-server-part-5/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── config.ts              # Prisma configuration
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Server entry point
│   ├── lib/
│   │   ├── auth.ts            # Authentication configuration
│   │   └── prisma.ts          # Prisma client instance
│   ├── middlewares/
│   │   └── auth.ts            # Authentication middleware
│   ├── modules/
│   │   ├── post/
│   │   │   ├── post.controller.ts
│   │   │   ├── post.router.ts
│   │   │   └── post.service.ts
│   │   └── comment/
│   │       ├── comment.controller.ts
│   │       ├── comment.router.ts
│   │       └── comment.service.ts
│   ├── helpers/
│   │   └── paginationSortingHelper.ts
│   └── scripts/
│       └── seedAdmin.ts       # Admin user seeding script
├── resources/                 # Project documentation
├── package.json
├── tsconfig.json
└── README.md
```

## Prerequisites

Before running this project, ensure you have the following installed:

1. **Node.js** (version 18 or higher) - [Download](https://nodejs.org/)
2. **pnpm** - Install globally: `npm install -g pnpm`
3. **PostgreSQL** (version 12 or higher) - [Download](https://www.postgresql.org/download/)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd prisma-blog-server-part-5
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/blog_db?schema=public"

# Application
APP_URL="http://localhost:4000"  # Frontend URL
PORT=3000

# Email (Gmail SMTP)
APP_USER="your-email@gmail.com"
APP_PASS="your-app-password"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Getting Gmail App Password

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > App passwords
4. Generate a password for "Mail"
5. Use this password as `APP_PASS`

### Setting up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
6. Use Client ID and Client Secret in `.env`

## Database Setup

1. **Create PostgreSQL database**:
   ```sql
   CREATE DATABASE blog_db;
   ```

2. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

3. **Run migrations**:
   ```bash
   npx prisma migrate deploy
   ```

4. **Seed admin user** (optional):
   ```bash
   pnpm run seed:admin
   ```

### Prisma Schema Details

The database schema is defined in `prisma/schema.prisma` and includes the following models:

#### User Model
```prisma
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]
  role          String?   @default("USER")
  phone         String?
  status        String?   @default("ACTIVE")
}
```
- Stores user information for Better Auth
- Includes role-based access (USER/ADMIN)
- Links to sessions and accounts for authentication

#### Post Model
```prisma
model Post {
  id         String      @id @default(uuid())
  title      String      @db.VarChar(225)
  content    String      @db.Text
  thumbnail  String?
  isFeatured Boolean     @default(false)
  status     PostStatus  @default(PUBLISHED)
  tags       String[]
  views      Int         @default(0)
  authorId   String
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
  comments   Comment[]
}
```
- Main blog post entity
- Supports tags as string array
- Has status enum (DRAFT/PUBLISHED/ARCHIVED)
- Links to comments and author

#### Comment Model
```prisma
model Comment {
  id       String       @id @default(uuid())
  content  String       @db.Text
  authorId String
  postId   String
  post     Post         @relation(fields: [postId], references: [id], onDelete: Cascade)
  parentId String?
  parent   Comment?     @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  replies  Comment[]    @relation("CommentReplies")
  status   CommentStatus @default(APPROVED)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
}
```
- Supports nested comments (replies)
- Has approval status (APPROVED/REJECT)
- Cascade delete when post is deleted

#### Session & Account Models
- **Session**: Manages user sessions for Better Auth
- **Account**: Stores OAuth account information
- **Verification**: Handles email verification tokens

#### Enums
```prisma
enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

enum CommentStatus {
  APPROVED
  REJECT
}
```

### Prisma Configuration

The Prisma setup includes:

- **Generator**: Generates TypeScript client in `generated/` directory
- **Datasource**: PostgreSQL connection using `DATABASE_URL`
- **Migrations**: Stored in `prisma/migrations/` with SQL files

### Working with Prisma

#### Common Prisma Commands
```bash
# Generate client after schema changes
npx prisma generate

# Create and apply migrations
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy

# View database in browser
npx prisma studio

# Reset database (development)
npx prisma migrate reset
```

#### Using Prisma Client in Code
```typescript
import { prisma } from './lib/prisma';

// Find posts with comments
const posts = await prisma.post.findMany({
  include: {
    comments: {
      include: {
        replies: true
      }
    }
  }
});

// Create a new post
const post = await prisma.post.create({
  data: {
    title: 'My Blog Post',
    content: 'Content here...',
    authorId: userId,
    tags: ['javascript', 'typescript']
  }
});
```

## Running the Application

1. **Development mode** (with hot reload):
   ```bash
   pnpm run dev
   ```

2. **Server will start on** `http://localhost:3000`

3. **Test the server**:
   - Visit `http://localhost:3000` - Should show "Hello, World!"

## API Endpoints

### Authentication
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session
- `POST /api/auth/verify-email` - Email verification

### Posts
- `GET /posts` - Get all posts (with pagination)
- `GET /posts/:postId` - Get post by ID
- `POST /posts` - Create new post (authenticated)
- `PUT /posts/:postId` - Update post (authenticated, author only)
- `DELETE /posts/:postId` - Delete post (authenticated, author only)

### Comments
- `GET /comments` - Get all comments
- `GET /comments/:commentId` - Get comment by ID
- `POST /comments` - Create new comment (authenticated)
- `PUT /comments/:commentId` - Update comment (authenticated, author only)
- `DELETE /comments/:commentId` - Delete comment (authenticated, author only)

## Authentication

The application uses Better Auth for authentication with the following features:

- Email and password authentication
- Google OAuth integration
- Email verification
- Session management
- Role-based access control (USER, ADMIN)

### User Roles

- **USER**: Can create posts and comments
- **ADMIN**: All USER permissions plus additional admin features

## Testing

### Manual Testing with cURL

1. **Get all posts**:
   ```bash
   curl http://localhost:3000/posts
   ```

2. **Create a post** (requires authentication):
   ```bash
   curl -X POST http://localhost:3000/posts \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "title": "My First Post",
       "content": "This is the content of my post.",
       "tags": ["javascript", "nodejs"]
     }'
   ```

### Using Postman

Import the following collection structure:

```
Prisma Blog API
├── Auth
│   ├── Sign Up
│   ├── Sign In
│   └── Get Session
├── Posts
│   ├── Get All Posts
│   ├── Get Post by ID
│   ├── Create Post
│   ├── Update Post
│   └── Delete Post
└── Comments
    ├── Get All Comments
    ├── Create Comment
    └── Update Comment
```

## Code Structure Explanation

### Server Entry Point (`src/server.ts`)
- Connects to the database
- Starts the Express server
- Handles graceful shutdown

### App Configuration (`src/app.ts`)
- Sets up Express middleware (CORS, JSON parsing)
- Configures authentication routes
- Mounts API routers

### Authentication (`src/lib/auth.ts`)
- Better Auth configuration
- Email verification setup
- Social provider configuration

### Database (`src/lib/prisma.ts`)
- Prisma client instance
- Database connection

### Modules
Each module follows MVC pattern:

- **Controller**: Handles HTTP requests/responses
- **Service**: Business logic
- **Router**: Route definitions and middleware

### Helpers
- `paginationSortingHelper.ts`: Utility for pagination and sorting

### Scripts
- `seedAdmin.ts`: Creates an admin user for testing

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests (if any)
5. Commit your changes: `git commit -am 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## Troubleshooting

### Common Issues

1. **Database connection error**:
   - Ensure PostgreSQL is running
   - Check `DATABASE_URL` in `.env`
   - Verify database exists

2. **Email not sending**:
   - Check Gmail credentials
   - Ensure app password is correct
   - Verify Gmail security settings

3. **Prisma errors**:
   - Run `npx prisma generate` after schema changes
   - Run `npx prisma migrate dev` for development

4. **Port already in use**:
   - Change `PORT` in `.env`
   - Kill process using the port

### Development Tips

- Use `console.log` for debugging
- Check server logs for errors
- Use Postman for API testing
- Read Prisma documentation for database queries

## License

This project is licensed under the ISC License.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.
