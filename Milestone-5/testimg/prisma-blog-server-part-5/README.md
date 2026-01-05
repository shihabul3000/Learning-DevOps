# Prisma Blog Server

## Project Overview
This project is a backend server for a blogging platform built using Node.js, TypeScript, and Prisma ORM. It uses PostgreSQL as the database and includes authentication via Better Auth. It follows a modular architecture for scalability and maintainability.

---

## **Step-by-Step Guide**

### **Step 1: Project Setup**

#### 1.1: Install Required Tools
Ensure the following tools are installed on your system:
- **Node.js**: JavaScript runtime. [Download Node.js](https://nodejs.org/)
- **pnpm**: Package manager. Install it globally using:
  ```bash
  npm install -g pnpm
  ```
- **PostgreSQL**: Database server. [Download PostgreSQL](https://www.postgresql.org/download/)

#### 1.2: Clone the Project
Clone the project repository to your local machine:
```bash
git clone <repository-link>
```

#### 1.3: Install Dependencies
Navigate to the project folder and install dependencies:
```bash
pnpm install
```

---

### **Step 2: Database Setup**

#### 2.1: Create a Database
Create a new PostgreSQL database. Example:
```sql
CREATE DATABASE prisma_blog_app;
```

#### 2.2: Configure Environment Variables
Create a `.env` file in the project root and add the database connection string:
```
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/prisma_blog_app"
```
Replace `<username>` and `<password>` with your PostgreSQL credentials.

#### 2.3: Run Prisma Migrations
Generate the database schema using Prisma:
```bash
npx prisma migrate dev
```

---

### **Step 3: Run the Project**

#### 3.1: Start the Development Server
Run the following command to start the development server:
```bash
pnpm dev
```
The server will start at `http://localhost:3000`.

---

### **Step 4: Code Analysis**

#### 4.1: Entry Points
- **`src/app.ts`**: Initializes the application, sets up middleware, and defines routes.
- **`src/server.ts`**: Configures and starts the server, connects to the database.

#### 4.2: Database and Prisma
- **`prisma/schema.prisma`**: Defines the database schema with models for Post, Comment, User, etc.
- **`src/lib/prisma.ts`**: Creates the Prisma client and connects to the database.

#### 4.3: Authentication
- **`src/lib/auth.ts`**: Configures Better Auth for user authentication.
- **`src/middlewares/auth.ts`**: Handles authentication middleware.

#### 4.4: Feature Modules
Each module contains three main files:
1. **Controller**: Handles HTTP requests.
2. **Service**: Contains business logic.
3. **Router**: Defines API routes.

Example: `post` module
- **`src/modules/post/post.controller.ts`**: Handles requests for posts.
- **`src/modules/post/post.service.ts`**: Contains post-related logic.
- **`src/modules/post/post.router.ts`**: Defines routes for post APIs.

Example: `comment` module
- **`src/modules/comment/comment.controller.ts`**: Handles requests for comments.
- **`src/modules/comment/comment.service.ts`**: Contains comment-related logic.
- **`src/modules/comment/comment.router.ts`**: Defines routes for comment APIs.

#### 4.5: Helper Functions
- **`src/helpers/paginationSortingHelper.ts`**: Provides pagination and sorting utilities.

#### 4.6: Scripts and Seeding
- **`src/scripts/seedAdmin.ts`**: Seeds the database with default admin data.

---

### **Step 5: Deployment**

#### 5.1: Build the Project
Generate the production build:
```bash
pnpm build
```

#### 5.2: Deploy to a Server
1. Set up a cloud server (e.g., AWS, DigitalOcean).
2. Upload the project files to the server.
3. Install dependencies on the server:
   ```bash
   pnpm install --production
   ```
4. Start the server:
   ```bash
   pnpm start
   ```

#### 5.3: Final Testing
Test the APIs and ensure everything is working as expected.

---

## **Folder Structure**

```
prisma-blog-server-part-5/
├── prisma/
│   ├── schema.prisma       # Database schema
│   ├── migrations/         # Prisma migrations
├── src/
│   ├── app.ts              # App initialization
│   ├── server.ts           # Server setup
│   ├── lib/
│   │   ├── auth.ts         # Better Auth configuration
│   │   └── prisma.ts       # Prisma client setup
│   ├── middlewares/
│   │   └── auth.ts         # Authentication middleware
│   ├── modules/
│   │   ├── post/           # Post module
│   │   │   ├── post.controller.ts
│   │   │   ├── post.service.ts
│   │   │   └── post.router.ts
│   │   └── comment/        # Comment module
│   │       ├── comment.controller.ts
│   │       ├── comment.service.ts
│   │       └── comment.router.ts
│   ├── helpers/
│   │   └── paginationSortingHelper.ts
│   ├── scripts/
│   │   └── seedAdmin.ts    # Database seeding script
├── .env                    # Environment variables
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
├── generated/              # Generated Prisma client
├── resources/              # Additional resources
```

---

## **Commands Reference**

### Development
- Start the development server:
  ```bash
  pnpm dev
  ```
- Seed admin data:
  ```bash
  pnpm seed:admin
  ```

### Prisma
- Run migrations:
  ```bash
  npx prisma migrate dev
  ```
- Open Prisma Studio:
  ```bash
  npx prisma studio
  ```

### Build and Deploy
- Build the project:
  ```bash
  pnpm build
  ```
- Start the production server:
  ```bash
  pnpm start
  ```

---

## **Additional Notes**

