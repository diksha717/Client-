# Team Task Manager - Full Stack Application

A production-ready team collaboration and task management web application built with modern tech stack.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Security Features](#security-features)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### 🔐 Authentication & Authorization
- User signup and login with email/password
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Admin/Member)
- Logout functionality
- Protected routes

### 👥 Role-Based Access Control
- **Admin**: Full control over projects, tasks, and team members
- **Member**: Access to assigned projects and tasks

### 📁 Project Management
- Create, read, update, delete projects
- Add/remove team members to projects
- Project descriptions and deadlines
- View team members for each project

### ✅ Task Management
- Create tasks with title, description, priority, and due date
- Assign tasks to team members
- Update task status (Pending/In Progress/Completed)
- Priority levels (Low/Medium/High)
- Task comments for collaboration

### 📊 Dashboard
- Overview statistics:
  - Total assigned projects
  - Total assigned tasks
  - Completed tasks count
  - Overdue tasks count
- Recent tasks list
- Recent projects list

### 🎯 Additional Features
- Activity logs for audit trail
- Task comments and discussions
- Task attachments support
- Real-time task status updates
- Advanced filtering and search
- Responsive mobile-friendly UI
- Modern UI with Tailwind CSS

## 🛠 Tech Stack

### Frontend
- **React.js** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **Prisma** - ORM
- **SQLite** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin requests

### Deployment
- **Railway** - Cloud platform for hosting

## 📂 Project Structure

```
team-task-manager/
├── client/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── Alert.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   ├── ProjectDetail.jsx
│   │   │   ├── Tasks.jsx
│   │   │   ├── TaskDetail.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── NotFound.jsx
│   │   ├── context/           # Context for state management
│   │   │   └── AuthContext.jsx
│   │   ├── utils/             # Utility functions
│   │   │   ├── api.js
│   │   │   ├── services.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   ├── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .env.example
│
├── server/                    # Backend (Node.js + Express)
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.js            # Seed script for demo data
│   ├── routes/                # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── controllers/           # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/                 # Utility functions
│   │   ├── jwt.js
│   │   ├── password.js
│   │   └── response.js
│   ├── index.js               # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── RAILWAY_DEPLOYMENT.md      # Deployment guide
└── README.md                  # This file
```

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd team-task-manager
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
cd ..
```

## ⚙️ Configuration

### Backend Setup

1. **Create environment file**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Update .env file**
   ```
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="your_super_secret_jwt_key_change_this"
   PORT=5000
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:5173"
   ```

3. **Initialize database**
   ```bash
   npm run prisma:migrate
   ```

4. **Seed demo data**
   ```bash
   npm run prisma:seed
   ```

### Frontend Setup

1. **Create environment file**
   ```bash
   cd client
   cp .env.example .env.local
   ```

2. **Update .env.local**
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

## 🚀 Running the Application

### Development Mode

**Terminal 1 - Start Backend**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Start Frontend**
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- API Health Check: http://localhost:5000/health

### Demo Accounts
After running `npm run prisma:seed`, you can login with:

**Admin Account:**
- Email: `admin@taskmanager.com`
- Password: `admin123`

**Member Account:**
- Email: `john@taskmanager.com`
- Password: `john123`

## 📚 API Documentation

### Authentication Endpoints

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Endpoints

**Get All Users**
```http
GET /api/users
Authorization: Bearer <token>
```

**Get Current User**
```http
GET /api/users/me
Authorization: Bearer <token>
```

**Get User Stats**
```http
GET /api/users/me/stats
Authorization: Bearer <token>
```

### Project Endpoints

**Create Project**
```http
POST /api/projects
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Website Redesign",
  "description": "Complete redesign of company website",
  "deadline": "2024-12-31"
}
```

**Get All Projects**
```http
GET /api/projects
Authorization: Bearer <token>
```

**Get Project by ID**
```http
GET /api/projects/:id
Authorization: Bearer <token>
```

**Update Project**
```http
PUT /api/projects/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Delete Project**
```http
DELETE /api/projects/:id
Authorization: Bearer <token>
```

**Add Project Member**
```http
POST /api/projects/:id/members
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": 2
}
```

### Task Endpoints

**Create Task**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Design homepage",
  "description": "Create homepage design",
  "priority": "high",
  "dueDate": "2024-12-15",
  "projectId": 1,
  "assignedToId": 2
}
```

**Get Tasks (with filters)**
```http
GET /api/tasks?status=pending&priority=high&projectId=1
Authorization: Bearer <token>
```

**Get Task by ID**
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

**Update Task**
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated title",
  "status": "in_progress",
  "priority": "medium"
}
```

**Delete Task**
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Add Task Comment**
```http
POST /api/tasks/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great progress on this task!"
}
```

## 🗄️ Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- name (String)
- email (UNIQUE)
- password (Hashed)
- role (admin/member)
- createdAt
- updatedAt
```

### Projects Table
```sql
- id (PRIMARY KEY)
- title (String)
- description (Text)
- deadline (DateTime)
- createdById (FK → Users.id)
- createdAt
- updatedAt
```

### ProjectMembers Table
```sql
- id (PRIMARY KEY)
- projectId (FK → Projects.id)
- userId (FK → Users.id)
- UNIQUE(projectId, userId)
```

### Tasks Table
```sql
- id (PRIMARY KEY)
- title (String)
- description (Text)
- priority (low/medium/high)
- status (pending/in_progress/completed)
- dueDate (DateTime)
- projectId (FK → Projects.id)
- assignedToId (FK → Users.id)
- createdAt
- updatedAt
```

### TaskComments Table
```sql
- id (PRIMARY KEY)
- content (Text)
- taskId (FK → Tasks.id)
- userId (FK → Users.id)
- createdAt
- updatedAt
```

### ActivityLogs Table
```sql
- id (PRIMARY KEY)
- action (created/updated/deleted)
- entity (project/task/member)
- entityId (Integer)
- details (Text)
- userId (FK → Users.id)
- createdAt
```

## 🚀 Deployment

### Deploying to Railway

1. **Read the deployment guide**
   ```bash
   cat RAILWAY_DEPLOYMENT.md
   ```

2. **Push to GitHub**
   ```bash
   git push origin main
   ```

3. **Connect to Railway**
   - Create Railway account at https://railway.app
   - Connect your GitHub repository
   - Set environment variables
   - Deploy

### Environment Variables for Production

**Backend:**
```
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=<secure-random-string>
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-url.railway.app
```

**Frontend:**
```
VITE_API_BASE_URL=https://your-backend-url.railway.app/api
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ Protected routes and endpoints
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling and logging
- ✅ Role-based access control
- ✅ Secure token expiration (7 days)
- ✅ XSS prevention with React
- ✅ SQL injection prevention with Prisma ORM

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Database Issues
```bash
# Reset database
rm server/prisma/dev.db*

# Recreate database and seed
cd server
npm run prisma:migrate
npm run prisma:seed
```

### CORS Errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend URL matches exactly
- Clear browser cache and cookies

### Can't Connect to Backend
- Verify backend is running: `http://localhost:5000/health`
- Check `VITE_API_BASE_URL` in frontend `.env`
- Verify network tab in browser dev tools

### Authentication Issues
- Check JWT token in localStorage
- Verify token hasn't expired
- Clear localStorage and re-login

## 📝 Development Tips

### Adding New Features

1. **Create a new page**
   ```bash
   # Add to src/pages/
   ```

2. **Create new API endpoints**
   ```bash
   # Add to server/routes/
   # Add controller logic
   # Update middleware if needed
   ```

3. **Update database schema**
   ```bash
   # Edit server/prisma/schema.prisma
   npm run prisma:migrate
   npm run prisma:seed
   ```

### Code Style
- Use ES6+ syntax
- Follow naming conventions
- Add comments for complex logic
- Keep functions small and focused

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Check existing GitHub issues
- Create a new issue with detailed description
- Include error logs and steps to reproduce

## 🎉 Acknowledgments

Built with modern web technologies for optimal performance and user experience.

---

**Happy coding!** 🚀
