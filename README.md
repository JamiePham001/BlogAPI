# BlogAPI - Full Stack Blog Application

## Project Overview

**BlogAPI** is a full-stack blog application exercise designed to practice building a RESTful API and integrating it with multiple frontend clients. The project demonstrates how to set up a backend API and access it from external frontend applications, with proper authentication, CORS handling, and production-ready deployment configuration.

### Key Features
- User authentication with JWT tokens
- Blog post creation, editing, publishing, and deletion
- Comment system on posts
- Role-based access (author vs. regular user)
- Token-based authorization
- CORS-enabled API for multiple frontend clients
- Production and development environment support

<img width="2553" height="1320" alt="image" src="https://github.com/user-attachments/assets/52a54577-bad1-4060-8b34-c4c45295a18e" />


---

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Password Hashing**: bcrypt (via scripts)
- **CORS**: cors middleware
- **Environment**: dotenv

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Routing**: React Router
- **Authentication**: JWT with Context API
- **Styling**: CSS Modules

### Development Tools
- ESLint for code quality
- Prisma CLI for database migrations

---

## Project Structure

```
BlogAPI/
├── backend/                    # Express.js API server
│   ├── app.js                 # Main server entry point
│   ├── package.json           # Backend dependencies
│   ├── .env.example           # Environment variables template
│   ├── controller/            # Request handlers/route logic
│   │   └── index.js          # All controller functions
│   ├── route/                 # API route definitions
│   │   └── index.js          # All route endpoints
│   ├── database/              # Database queries using Prisma
│   │   ├── pg.js             # Database connection
│   │   └── queries.js        # Prisma query functions
│   ├── prisma/                # Prisma ORM configuration
│   │   ├── schema.prisma     # Database schema definition
│   │   └── migrations/       # Database migration files
│   └── public/
│       └── scripts.js        # Utility functions (JWT, password hashing)
│
├── blog_author/               # React frontend for blog authors
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── AuthContext.jsx   # Authentication context
│   │   ├── router.jsx        # Route configuration
│   │   ├── components/       # Reusable components
│   │   └── pages/            # Page components
│   ├── package.json
│   └── vite.config.js
│
├── blog_users/                # React frontend for regular users
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── AuthContext.jsx   # Authentication context
│   │   ├── router.jsx        # Route configuration
│   │   ├── components/       # Reusable components
│   │   └── pages/            # Page components
│   ├── package.json
│   └── vite.config.js
│
└── README.md                  # This file
```

---

## Database Schema

### User Model
```prisma
model User {
  id           String   @id @default(cuid())
  passwordHash String
  username     String   @unique
  author       Boolean  @default(false)
  
  comments     Comment[]
  posts        Post[]
}
```
- `username`: Unique identifier for login
- `author`: Boolean flag indicating if user can create/publish posts
- Relations: Can have multiple posts and comments

### Post Model
```prisma
model Post {
  id           String    @id @default(cuid())
  createdAt    DateTime  @default(now())
  updatedAt    DateTime? @updatedAt
  title        String
  introduction String?
  content      String?
  published    Boolean   @default(false)
  author       User      @relation(fields: [authorId], references: [id])
  authorId     String

  comments     Comment[]
}
```
- `published`: Indicates if post is visible to public
- `authorId`: Foreign key relation to User
- Relations: Can have multiple comments

### Comment Model
```prisma
model Comment {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  username  String   # Denormalized for display purposes
}
```
- Links comments to both posts and users
- Stores username for display without requiring joins

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register new user |
| POST | `/api/login` | Login user and receive JWT token |

### Posts (Protected with `*` requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts/get` | Get all published posts |
| GET | `/api/posts/get/:id` | Get post by ID |
| POST | `/api/posts/create` * | Create new post (draft) |
| PUT | `/api/posts/update/:id` * | Update post content |
| POST | `/api/posts/publish/:id` * | Publish a post |
| POST | `/api/posts/unpublish/:id` * | Unpublish a post |
| DELETE | `/api/posts/delete/:id` * | Delete a post |

### Comments (Protected with `*` requires authentication)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/comments/create` * | Create comment on post |
| DELETE | `/api/comments/delete/:id` * | Delete comment |
| GET | `/api/comments/get/:id` * | Get comments for post |

---

## Authentication & Authorization

### JWT Token Structure
```javascript
{
  id: "user_id",
  username: "username",
  isAuthor: boolean,
  exp: timestamp  // Expiration time
}
```

### Token Flow
1. User registers/logs in at `/api/register` or `/api/login`
2. Backend returns JWT token
3. Frontend stores token in localStorage
4. Token is sent in Authorization header for protected endpoints
5. `verifyToken` middleware validates JWT before processing request

### Protected Routes
Routes requiring `scripts.verifyToken` middleware:
- All POST/PUT/DELETE operations on posts
- All POST/DELETE operations on comments
- Getting comments for a post

---

## Development Setup

### Prerequisites
- Node.js 16+ installed
- PostgreSQL database (local or remote)

### Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Configure your environment
# Edit .env with:
# - DATABASE_URL=postgresql://user:password@localhost:5432/blog_api
# - JWT_SECRET=your_secret_key
# - NODE_ENV=development
# - PORT=3000 (optional)

# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Frontend Setup (blog_author & blog_users)
```bash
cd blog_author  # or blog_users

# Install dependencies
npm install

# Start development server with HMR
npm run dev
```

The frontend will run on:
- `blog_author`: http://localhost:5173
- `blog_users`: http://localhost:5174

Backend defaults to `http://localhost:3000`

---

## Production Deployment

### Environment Configuration
Update `.env` for production:
```bash
NODE_ENV=production
PORT=3000 (or your hosting provider's port)
DATABASE_URL=postgresql://prod_user:password@prod_host:5432/blog_api_prod
CORS_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
JWT_SECRET=your_strong_secret_key
```

### CORS Origins
- **Development**: Defaults to `http://localhost:5173` and `http://localhost:5174`
- **Production**: Set via `CORS_ORIGINS` environment variable (comma-separated list)

### Database Setup
1. **Create PostgreSQL Database**
   - Use managed service: Railway, Render, Heroku Postgres, AWS RDS, etc.
   - Or self-hosted on VPS (DigitalOcean, Linode, AWS EC2)

2. **Apply Migrations**
   ```bash
   npm run migrate:prod
   ```

3. **Verify Schema**
   ```bash
   npm run studio  # Opens Prisma Studio to inspect data
   ```

### Deployment Platforms
**Recommended for Node.js backend:**
- **Railway**: Simple platform as a service with PostgreSQL
- **Render**: Free tier available, PostgreSQL support
- **Heroku**: Classic deployment platform
- **AWS/Azure/Google Cloud**: Enterprise options with full control

### Available npm Scripts
```bash
npm run dev          # Start server in development mode
npm run start        # Start server in production mode
npm run build        # Generate Prisma Client
npm run migrate      # Create/apply development migrations
npm run migrate:prod # Apply migrations to production database
npm run studio       # Open Prisma Studio GUI
```

---

## Cross-Origin Resource Sharing (CORS)

The backend is configured to handle requests from multiple frontend applications:

### How It Works
1. `app.js` reads `CORS_ORIGINS` environment variable
2. Origins are parsed into array and passed to CORS middleware
3. Browser can make requests from listed origins
4. Credentials (cookies/auth headers) are allowed

### CORS Configuration Examples

**Development** (defaults if no env var set):
```javascript
origin: ["http://localhost:5173", "http://localhost:5174"]
```

**Production** (.env):
```
CORS_ORIGINS=https://blog.example.com,https://admin.example.com
```

---

## Key Implementation Notes

### Frontend Authentication Context
- Both `blog_author` and `blog_users` use React Context for auth state
- Tokens are checked on app load and validated
- Expired tokens are automatically removed
- State updates are batched to avoid React warnings

### Token Verification
- JWT tokens include expiration time
- Frontend checks expiration before making requests
- Backend verifies token on protected endpoints
- Failed verification returns 401 Unauthorized

### Database Migrations
- Prisma schema changes generate SQL migrations
- Migrations are version-controlled in `prisma/migrations/`
- Each migration includes up/down operations
- Use `prisma migrate dev` for development changes

### Security Considerations
- Passwords are hashed using bcrypt
- JWT secret should be strong and unique per environment
- CORS restricts requests to known domains only
- Token validation happens server-side for all protected routes
- Sensitive data (passwords) never stored in JWT

---

## Common Tasks

### Adding a New Database Field
```bash
# 1. Update prisma/schema.prisma
# 2. Run migration
npm run migrate

# 3. Name your migration (e.g., "add_bio_field")
```

### Creating a New API Endpoint
1. Add route in `backend/route/index.js`
2. Add controller function in `backend/controller/index.js`
3. Add database query in `backend/database/queries.js` if needed
4. Test with frontend or API client (Postman, curl, etc.)

### Debugging Database Issues
```bash
npm run studio  # Visual database browser and editor
```

---

## Troubleshooting

### CORS Errors
**Problem**: "Access to XMLHttpRequest blocked by CORS policy"
- **Solution**: Ensure frontend URL is in `CORS_ORIGINS` environment variable
- **Development**: Frontend should be on localhost:5173 or 5174
- **Production**: Add production domain to `CORS_ORIGINS`

### Token Expired
**Problem**: 401 Unauthorized errors despite being logged in
- **Solution**: Token is expired. User needs to log in again
- Frontend automatically handles expired tokens by redirecting to login

### Database Connection Failed
**Problem**: Cannot connect to PostgreSQL
- **Solution**: Verify `DATABASE_URL` in `.env`
- Check database is running and accessible
- Verify username, password, host, and port

---

## Learning Outcomes

This project covers:
- ✅ Building a RESTful API with Express.js
- ✅ Database design with relational models
- ✅ User authentication with JWT tokens
- ✅ CORS and cross-origin request handling
- ✅ Environment-based configuration (dev vs. production)
- ✅ React Context API for state management
- ✅ Integration between multiple frontend applications
- ✅ Database migrations and versioning
- ✅ Production deployment considerations

---

## License

This is an educational project created as part of The Odin Project curriculum.
